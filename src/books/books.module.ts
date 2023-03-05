import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { BookEntity } from '../admin/admin-book/entities/admin-book.entity';
import { BorrowBookEntity } from '../borrow-book/entities/borrow-book.entity';
import { BorrowBookService } from '../borrow-book/services/borrow-book.service';
import { UserInterestsEntity } from '../user/entities/user-interests.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserInterestsService } from '../user/services/user-interests.service';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { WalletService } from '../wallet/wallet.service';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
    imports: [
        TypegooseModule.forFeature([BookEntity, UserEntity, BorrowBookEntity, WalletEntity, UserInterestsEntity]),
    ],
    controllers: [BooksController],
    providers: [BooksService, BorrowBookService, WalletService, UserInterestsService],
})
export class BooksModule {}
