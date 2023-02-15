import { PartialType } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';
import { PaginationQueryDto } from '../../../common';

export class CreateAdminUserDto {}

export class UpdateAdminUserDto extends PartialType(CreateAdminUserDto) {}

export class AdminUserQueryDto extends PaginationQueryDto {}

export class AdminUserDto extends UserEntity {}
