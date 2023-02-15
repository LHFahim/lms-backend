import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserEntity } from '../../user/entities/user.entity';
import { AdminBookController } from './admin-book.controller';
import { AdminBookService } from './admin-book.service';
import { BookEntity } from './entities/admin-book.entity';

@Module({
    imports: [TypegooseModule.forFeature([BookEntity, UserEntity])],
    controllers: [AdminBookController],
    providers: [AdminBookService],
})
export class AdminBookModule {}
