import { OmitType, PartialType, PickType } from '@nestjs/swagger';

import { Expose } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserEntity } from '../entities/user.entity';

export class UserDto extends PickType(UserEntity, [
    '_id',
    'firstName',
    'lastName',
    'email',
    'avatarURL',
    'isEmailVerified',
    'lastLogin',
    'shortBio',
    'phoneNumber',
    'walletId',
    'panelType',
]) {}

export class UserProfileDto {
    @Expose()
    user: UserDto;
}

export class UserLiteDto extends PartialType(
    PickType(UserEntity, ['_id', 'email', 'isEmailVerified', 'createdAt', 'updatedAt']),
) {}

export class UpdateUserDto extends PartialType(OmitType(UserEntity, ['_id', 'email', 'createdAt', 'updatedAt'])) {}

export class UserPaginatedDto {
    @Expose()
    items: UserDto[];

    @Expose()
    pagination: PaginationDto;
}
