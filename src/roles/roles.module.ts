import { Global, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { PermissionModule } from '../permission/permission.module';
import { RoleEntity } from './entities/role.entity';

@Global()
@Module({
  imports: [TypegooseModule.forFeature([RoleEntity]), PermissionModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
