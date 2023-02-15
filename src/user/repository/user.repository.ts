import { Injectable } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { FilterQuery, Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(UserEntity)
        private readonly userModel: ReturnModelType<typeof UserEntity>,
    ) {}

    findByID(id: string) {
        return this.userModel.findById(id);
    }

    findByEmail(email: string) {
        return this.findOne({ email });
    }

    // async create(user: RegisterDto): Promise<DocumentType<UserEntity>> {
    //   return await this.userModel.create(user);
    // }
    async create(user: UserEntity): Promise<DocumentType<UserEntity>> {
        return await this.userModel.create(user);
    }

    async findAll(): Promise<DocumentType<UserEntity>[]> {
        return this.userModel.find();
    }

    async findOne(query: FilterQuery<UserEntity>, populate: string[] = []): Promise<DocumentType<UserEntity> | null> {
        return this.userModel.findOne({ ...query, isDeleted: false }).populate(populate);
    }

    async update(_id: string | Types.ObjectId, user: Partial<UserEntity>): Promise<DocumentType<UserEntity> | null> {
        return this.userModel.findOneAndUpdate(
            { _id },
            {
                $set: user,
            },
            { new: true },
        );
    }

    async authUser(id: string) {
        // todo: need more work like role, company population
        return this.findByID(id);
    }
}
