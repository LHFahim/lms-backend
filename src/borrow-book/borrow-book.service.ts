import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { add, intervalToDuration } from 'date-fns';
import { InjectModel } from 'nestjs-typegoose';
import { SerializeService } from '../../libs/utils/src/serializer/serialize.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { BorrowBookEntity } from './entities/borrow-book.entity';

@Injectable()
export class BorrowBookService extends SerializeService<BorrowBookEntity> {
    constructor(
        @InjectModel(BorrowBookEntity) private readonly borrowBookModel: ReturnModelType<typeof BorrowBookEntity>,
    ) {
        super(BorrowBookEntity);
    }

    async findBorrowedBooks(userId: string) {
        const doc = await this.borrowBookModel.findOne({ borrower: userId, isReturned: false }).populate('bookId');

        const remainingDays = intervalToDuration({ start: doc.borrowedDate.toDate(), end: doc.returnDate.toDate() });

        return this.toJSON(
            {
                book: doc.bookId,
                borrowedDate: doc.borrowedDate,
                returnDate: doc.returnDate,
                remainingDays,
                isReturned: doc.isReturned,
            },
            BorrowBookDto,
        );
    }

    async addBorrowedBookDetails(userId: string, bookId: string) {
        const doc = await this.borrowBookModel.create({
            bookId,
            borrower: userId,
            borrowedDate: new Date().toDateString(),
            returnDate: add(new Date(), { days: 15 }).toDateString(),
            isReturned: false,
        });
    }

    async changeStatusForBorrowedBook(userId: string, bookId: string) {
        const doc = await this.borrowBookModel.findOneAndUpdate(
            {
                bookId,
                borrower: userId,
            },
            { isReturned: true },
            { new: true },
        );
    }
}
