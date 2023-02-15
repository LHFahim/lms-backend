import { SerializeService } from '@app/utils/serializer/serialize.service';
import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { Permissions } from '../common';
import { PermissionSeedData } from '../permission/data/permissions-seed';
import { PermissionService } from '../permission/permission.service';
import { RoleSeedData } from './data/roles-seed';
import { RoleDto } from './dto/role.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesService extends SerializeService<RoleEntity> {
  private logger = new Logger(RolesService.name);

  constructor(
    @InjectModel(RoleEntity)
    private readonly roleModel: ReturnModelType<typeof RoleEntity>,
    private readonly permissionsService: PermissionService,
  ) {
    super(RoleEntity);
  }

  async onModuleInit() {
    await this.permissionsService.seedDefaultPermissions();
    await this.seedDefaultRoles();
  }

  async getRoles() {
    const roles = await this.roleModel.find();

    return this.toJSON(roles, RoleDto);
  }

  async seedDefaultRoles() {
    await Promise.allSettled(
      RoleSeedData.map(({ id, ...role }) => {
        return this.roleModel.findOneAndUpdate(
          { _id: id },
          { _id: id, ...role },
          { upsert: true, new: true },
        );
      }),
    );

    this.logger.log('Roles Seed Done!');
    return true;
  }

  async hasPermission(
    user: AuthUserDto,
    permission: Permissions,
    path: string,
  ) {
    // not doing database query for faster lookup. could query & cache but that's for later
    const matchedPermission = PermissionSeedData.find(
      (permissionData) =>
        permissionData.permission === permission &&
        path.includes(
          `v${permissionData.apiVersion}/${permissionData.controller}/${permissionData.apiPath}`,
        ),
    );
    if (!matchedPermission) return false;

    return !!RoleSeedData.find(
      (role) =>
        role.name === user.roleName &&
        role.permissions.find((permissionId) =>
          permissionId.equals(matchedPermission.id),
        ),
    );
  }
}
