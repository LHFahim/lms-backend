import { Controller, Get } from '@nestjs/common';
import { Query, UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../../libs/utils/src';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum, Routes } from '../../common';
import { AdminUserService } from './admin-user.service';
import { AdminUserQueryDto } from './dto/admin-user.dto';

@ApiTags('Admin ===> users')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.AdminUsers, version: APIVersions.V1 })
export class AdminUserController {
    constructor(private readonly adminUserService: AdminUserService) {}

    @Get(Routes[ControllersEnum.AdminUsers].findAllAdminUsers)
    findAllAdminUsers(@UserId() userId: string, @Query() query: AdminUserQueryDto) {
        return this.adminUserService.findAllAdminUsers(userId, query);
    }
}
