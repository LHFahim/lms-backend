import { SerializeService } from '@app/utils/serializer/serialize.service';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserPaginatedDto } from '../../user/dto/user.dto';
import { PanelType } from './../../user/entities/user.entity';
import { AdminUserDto, AdminUserQueryDto } from './dto/admin-user.dto';

@Injectable()
export class AdminUserService extends SerializeService<UserEntity> {
    constructor(@InjectModel(UserEntity) private readonly userModel: ReturnModelType<typeof UserEntity>) {
        super(UserEntity);
    }

    async findAllAdminUsers(userId: string, query: AdminUserQueryDto): Promise<UserPaginatedDto> {
        const docs = await this.userModel
            .find({ isDeleted: false, panelType: PanelType.ADMIN })
            .sort({ [query.sortBy]: query.sort })
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize);

        const docsCount = await this.userModel.count({ isDeleted: false, panelType: PanelType.ADMIN });

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
}
