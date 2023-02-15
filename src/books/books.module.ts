import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { BookEntity } from '../admin/admin-book/entities/admin-book.entity';
import { BorrowBookService } from '../borrow-book/borrow-book.service';
import { BorrowBookEntity } from '../borrow-book/entities/borrow-book.entity';
import { UserEntity } from '../user/entities/user.entity';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
    imports: [TypegooseModule.forFeature([BookEntity, UserEntity, BorrowBookEntity])],
    controllers: [BooksController],
    providers: [BooksService, BorrowBookService],
})
export class BooksModule {}
