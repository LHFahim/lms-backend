import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserEntity } from 'src/user/entities/user.entity';
import { AdminClientController } from './admin-client.controller';
import { AdminClientService } from './admin-client.service';

@Module({
    imports: [TypegooseModule.forFeature([UserEntity])],
    controllers: [AdminClientController],
    providers: [AdminClientService],
})
export class AdminClientModule {}
