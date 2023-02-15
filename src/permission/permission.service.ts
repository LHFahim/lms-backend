import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { PermissionSeedData } from './data/permissions-seed';
import { PermissionEntity } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  private logger = new Logger(PermissionService.name);
  constructor(
    @InjectModel(PermissionEntity)
    private readonly permissionModel: ReturnModelType<typeof PermissionEntity>,
  ) {}

  async seedDefaultPermissions() {
    await this.removeObsoleteDefaultPermissions();

    await Promise.allSettled(
      PermissionSeedData.map((permissionSeed) => {
        const { id, ...permission } = permissionSeed;
        return this.permissionModel.findOneAndUpdate(
          { _id: id },
          { _id: id, ...permission },
          { upsert: true, new: true },
        );
      }),
    );

    this.logger.log('Permissions Seed Done!');
    return true;
  }

  async removeObsoleteDefaultPermissions() {
    const permissions = await this.permissionModel.find();

    for (const permission of permissions) {
      if (
        !PermissionSeedData.find((permissionSeed) =>
          permissionSeed.id.equals(permission.id),
        )
      ) {
        await this.permissionModel.findByIdAndDelete(permission.id);
      }
    }
  }
}
