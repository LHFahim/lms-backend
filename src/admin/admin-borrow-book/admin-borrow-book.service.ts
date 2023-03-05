import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BorrowBookEntity } from '../../borrow-book/entities/borrow-book.entity';
import { SerializableService } from '../../interfaces/serializable.class';
import { UserEntity } from '../../user/entities/user.entity';
import { AdminAuthService } from '../admin-auth/auth.service';
import { BookEntity } from './../admin-book/entities/admin-book.entity';
import { AdminBorrowBookDto } from './dto/admin-borrow-book.dto';

@Injectable()
export class AdminBorrowBookService extends SerializableService<BorrowBookEntity> {
    constructor(
        @InjectModel(BorrowBookEntity) private readonly borrowBookModel: ReturnModelType<typeof BorrowBookEntity>,
        @InjectModel(BookEntity) private readonly bookModel: ReturnModelType<typeof BookEntity>,
        private readonly adminAuthService: AdminAuthService,
        private readonly mailService: MailerService,
    ) {
        super(BorrowBookEntity);
    }

    async findAllBorrowedBooks(userId: string) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const docs = await this.borrowBookModel.find({ isReturned: false }).populate('bookId').populate('borrower');

        return this.toJSON(docs, AdminBorrowBookDto);
    }

    async acceptReturnBook(userId: string, bookId: string, borrowerId: string) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const doc = await this.bookModel.findOne({ _id: bookId });
        if (!doc) throw new BadRequestException('Request cannot be completed');

        const newBorrow = doc.borrowedBy.filter((el) => el.toString() !== borrowerId);

        doc.borrowedBy = newBorrow;
        doc.quantity++;

        await doc.save();

        const res = await this.changeStatusForBorrowedBook(borrowerId, bookId);

        return this.toJSON(res, AdminBorrowBookDto);
    }

    async changeStatusForBorrowedBook(borrowerId: string, bookId: string) {
        const doc = await this.borrowBookModel.findOneAndUpdate(
            {
                bookId,
                borrower: borrowerId,
                isReturned: false,
            },
            { isReturned: true },
            { new: true },
        );
        return this.toJSON(doc, AdminBorrowBookDto);
    }

    @Cron(CronExpression.EVERY_DAY_AT_10PM, {
        name: 'Cron job from Book Service',
    })
    async handleBorrowBookCron() {
        console.log('this is cron at every 10 seconds');
        const docs = await this.borrowBookModel
            .find({
                isReturned: false,
                returnDate: { $lt: new Date().toISOString() },
            })
            .populate('borrower')
            .populate('bookId');

        docs.forEach(async (data) => {
            const { borrower, bookId } = data;
            console.log(bookId);
            const userEmail = (borrower as UserEntity).email;
            const borrowedBook = (bookId as BookEntity).title;
            const author = (bookId as BookEntity).author;

            await this.mailService.sendMail({
                to: userEmail,
                from: process.env.SEND_GRID_SENDER_EMAIL,
                subject: 'Delay of book return',
                text: `Dear reader. ${'\n'}You failed to return the book titled ${borrowedBook} by ${author}. As a result, we have fined you xyz amount. Please return the book as soon as possible. ${'\n'}Regards, ${'\n'}Online Library Management System`,
            });
        });
    }
}
