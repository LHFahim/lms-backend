import { Global, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserService } from './services/user.service';

@Global()
@Module({
    imports: [TypegooseModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService, UserRepository],
})
export class UserModule {}
