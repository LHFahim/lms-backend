import { Global, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { BookEntity } from '../admin/admin-book/entities/admin-book.entity';
import { UserInterestsController } from './controllers/user-interests.controller';
import { UserController } from './controllers/user.controller';
import { UserInterestsEntity } from './entities/user-interests.entity';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserInterestsService } from './services/user-interests.service';
import { UserService } from './services/user.service';

@Global()
@Module({
    imports: [TypegooseModule.forFeature([UserEntity, UserInterestsEntity, BookEntity])],
    controllers: [UserController, UserInterestsController],
    providers: [UserService, UserRepository, UserInterestsService],
    exports: [UserService, UserRepository],
})
export class UserModule {}
