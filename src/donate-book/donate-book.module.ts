import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AdminAuthService } from '../admin/admin-auth/auth.service';
import { AdminBookService } from '../admin/admin-book/admin-book.service';
import { BookEntity } from '../admin/admin-book/entities/admin-book.entity';
import { DiscussionEntity } from '../discussion/entities/discussion.entity';
import { DiscussionService } from '../discussion/services/discussion.service';
import { UserEntity } from '../user/entities/user.entity';
import { OTPEntity } from './../admin/admin-auth/entities/otp';
import { DonateBookController } from './donate-book.controller';
import { DonateBookService } from './donate-book.service';
import { DonateBookEntity } from './entities/donate-book.entity';

@Module({
    imports: [
        TypegooseModule.forFeature([BookEntity, DonateBookEntity, BookEntity, DiscussionEntity, UserEntity, OTPEntity]),
    ],
    controllers: [DonateBookController],
    providers: [DonateBookService, AdminBookService, AdminAuthService, DiscussionService],
})
export class DonateBookModule {}
