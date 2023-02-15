import { StorageService } from '@app/storage';
import { optimizeImage } from '@app/utils/image';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SerializableService } from '../interfaces/serializable.class';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthProvider, UserEntity } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';

export interface UserCreatePayload {
    email: string;
    password: string;
    name: string;
    avatarURL: string;
    authProvider: AuthProvider;
    uid: string;
}

@Injectable()
export class UserService extends SerializableService<UserEntity> {
    constructor(private readonly userRepo: UserRepository, private storageService: StorageService) {
        super(UserEntity);
    }

    async create(body: UserEntity) {
        return this.userRepo.create(body);
    }

    async findByID(_id: string) {
        return await this.userRepo.findOne({ _id });
    }

    async authUser(id: string) {
        return this.userRepo.authUser(id);
    }

    async update(id: string, body: UpdateUserDto) {
        const user = await this.userRepo.update(id, body);
        if (!user) throw new NotFoundException(`User with ID "${id}" not found`);

        return this.toJSON(user);
    }

    async findByEmail(email: string) {
        return this.userRepo.findByEmail(email);
    }

    async updateAvatar(userId: string, image: Buffer) {
        const user = await this.userRepo.findOne({ _id: userId });
        if (!user) throw new NotFoundException('User not found');

        const optimized = await optimizeImage(image, { height: 1024, width: 1024 });

        // user.avatarURL = await this.storageService.upload(
        //     'avatars',
        //     `${userId}_${Date.now()}.webp`,
        //     optimized,
        //     user.avatarURL,
        // );

        user.avatarURL = `avatar${userId}_${Date.now()}.webp`;

        await user.save();

        return user;
    }
}
