import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BorrowBookEntity } from '../../borrow-book/entities/borrow-book.entity';
import { BorrowRequestEntity } from '../../borrow-book/entities/borrow-request.entity';
import { BorrowBookService } from '../../borrow-book/services/borrow-book.service';
import { SerializableService } from '../../interfaces/serializable.class';
import { UserEntity } from '../../user/entities/user.entity';
import { UserInterestsService } from '../../user/services/user-interests.service';
import { AdminAuthService } from '../admin-auth/auth.service';
import { BookDto } from '../admin-book/dto/admin-book.dto';
import { BookEntity } from './../admin-book/entities/admin-book.entity';
import { AdminBorrowBookDto } from './dto/admin-borrow-book.dto';

@Injectable()
export class AdminBorrowBookService extends SerializableService<BorrowBookEntity> {
    constructor(
        @InjectModel(BorrowBookEntity) private readonly borrowBookModel: ReturnModelType<typeof BorrowBookEntity>,
        @InjectModel(BookEntity) private readonly bookModel: ReturnModelType<typeof BookEntity>,
        @InjectModel(BorrowRequestEntity)
        private readonly borrowRequestModel: ReturnModelType<typeof BorrowRequestEntity>,
        private readonly adminAuthService: AdminAuthService,
        private readonly mailService: MailerService,
        private readonly borrowBookService: BorrowBookService,
        private readonly interestService: UserInterestsService,
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

    async approveRequest(userId: string, bookId: string, requesterId: string) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const existingDoc = await this.bookModel.findOne({
            _id: bookId,
            isAvailable: true,
            isDeleted: false,
            quantity: { $gt: 0 },
        });
        if (!existingDoc) throw new NotFoundException('Book was not found');

        let flag = false;

        for (let i = 0; i < existingDoc.borrowedBy.length; i++) {
            if (existingDoc.borrowedBy[i].toString() === requesterId) {
                flag = true;
                break;
            }
        }
        if (flag) throw new BadRequestException('You have already borrowed this book');

        const doc = await this.bookModel.findOneAndUpdate(
            { _id: bookId, isAvailable: true, isDeleted: false, quantity: { $gt: 0 } },
            { $inc: { quantity: -1 }, $addToSet: { borrowedBy: requesterId } },
            { new: true },
        );
        if (!doc) throw new BadRequestException('Request cannot be completed');

        await this.borrowBookService.addBorrowedBookDetails(requesterId, bookId);

        await this.interestService.addInterestsToUser(requesterId, doc._id, doc.tags);

        await this.borrowRequestModel.findOneAndUpdate(
            {
                book: bookId,
                requester: requesterId,
                isApproved: false,
                isDeleted: false,
            },
            { isApproved: true },
            { new: true },
        );

        return this.toJSON(doc, BookDto);
    }

    async declineRequest(userId: string, bookId: string, requesterId: string) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const doc = await this.borrowRequestModel.findOneAndDelete({
            book: bookId,
            requester: requesterId,
            isApproved: false,
        });
        if (!doc) throw new BadRequestException("Request couldn't be processed.");

        return true;
    }

    @Cron(CronExpression.EVERY_DAY_AT_2AM, {
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

            // const res = await this.mailService.sendMail({
            //     to: userEmail,
            //     from: process.env.SEND_GRID_SENDER_EMAIL,
            //     subject: 'Delay of book return',
            //     text: `Dear reader. ${'\n'}You failed to return the book titled ${borrowedBook} by ${author}. As a result, we have fined you xyz amount. Please return the book as soon as possible. ${'\n'}Regards, ${'\n'}${'\n'}Fahim,${'\n'}Online Library Management System`,
            // });
        });
    }
}
