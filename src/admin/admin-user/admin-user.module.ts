import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserEntity } from 'src/user/entities/user.entity';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';

@Module({
    imports: [TypegooseModule.forFeature([UserEntity])],
    controllers: [AdminUserController],
    providers: [AdminUserService],
})
export class AdminUserModule {}
