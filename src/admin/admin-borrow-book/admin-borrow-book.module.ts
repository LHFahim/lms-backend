import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { BorrowBookEntity } from '../../borrow-book/entities/borrow-book.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { AdminAuthService } from '../admin-auth/auth.service';
import { OTPEntity } from '../admin-auth/entities/otp';
import { BookEntity } from '../admin-book/entities/admin-book.entity';
import { AdminBorrowBookController } from './admin-borrow-book.controller';
import { AdminBorrowBookService } from './admin-borrow-book.service';

@Module({
    imports: [TypegooseModule.forFeature([BorrowBookEntity, OTPEntity, UserEntity, BookEntity])],
    controllers: [AdminBorrowBookController],
    providers: [AdminBorrowBookService, AdminAuthService],
})
export class AdminBorrowBookModule {}
