import { SerializeService } from '@app/utils/serializer/serialize.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserDto, UserPaginatedDto } from '../../user/dto/user.dto';
import { PanelType } from '../../user/entities/user.entity';
import { AdminUserDto, AdminUserQueryDto } from './dto/admin-client.dto';

@Injectable()
export class AdminClientService extends SerializeService<UserEntity> {
    constructor(@InjectModel(UserEntity) private readonly userModel: ReturnModelType<typeof UserEntity>) {
        super(UserEntity);
    }

    async findAllClientUsers(userId: string, query: AdminUserQueryDto): Promise<UserPaginatedDto> {
        const docs = await this.userModel
            .find({ isDeleted: false, panelType: PanelType.CLIENT })
            .sort({ [query.sortBy]: query.sort })
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize);

        const docsCount = await this.userModel.count({ isDeleted: false, panelType: PanelType.CLIENT });

        return {
            items: this.toJSONs(docs, AdminUserDto),
            pagination: {
                total: docsCount,
                current: query.page,
                previous: query.page === 1 ? 1 : query.page - 1,
                next: docs.length > query.page * query.pageSize ? query.page + 1 : query.page,
            },
        };
    }

    async blockClientUser(userId: string, id: string) {
        const doc = await this.userModel.findOneAndUpdate(
            { _id: id, isDeleted: false, isActive: true },
            { isActive: false },
            { new: true },
        );

        if (!doc) throw new NotFoundException('User is not found');

        return this.toJSON(doc, UserDto);
    }
}
