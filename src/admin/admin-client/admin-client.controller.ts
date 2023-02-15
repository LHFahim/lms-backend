import { Controller, Get } from '@nestjs/common';
import { Patch, Query, UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../../libs/utils/src';
import { ResourceId } from '../../../libs/utils/src/request/validate-resource-ids.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum, Routes } from '../../common';
import { AdminClientService } from './admin-client.service';
import { AdminUserQueryDto } from './dto/admin-client.dto';

@ApiTags('Admin ===> clients')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.AdminClients, version: APIVersions.V1 })
export class AdminClientController {
    constructor(private readonly adminClientService: AdminClientService) {}

    @Get(Routes[ControllersEnum.AdminUsers].findAllClientUsers)
    findAllClientUsers(@UserId() userId: string, @Query() query: AdminUserQueryDto) {
        return this.adminClientService.findAllClientUsers(userId, query);
    }

    @Patch(Routes[ControllersEnum.AdminUsers].blockClientUser)
    blockClientUser(@UserId() userId: string, @ResourceId() id: string) {
        return this.adminClientService.blockClientUser(userId, id);
    }
}
