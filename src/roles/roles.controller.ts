import { Serialize } from '@app/utils';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum, Routes } from '../common';
import { RolesService } from './roles.service';

@ApiTags('Role')
@ApiBearerAuth()
@Serialize()
@Controller({ path: ControllersEnum.Roles, version: APIVersions.V1 })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(Routes[ControllersEnum.Roles].list)
  getRoles() {
    return this.rolesService.getRoles();
  }
}
