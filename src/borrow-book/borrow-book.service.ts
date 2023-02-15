import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { add } from 'date-fns';
import { InjectModel } from 'nestjs-typegoose';
import { SerializeService } from '../../libs/utils/src/serializer/serialize.service';
import { BorrowBookEntity } from './entities/borrow-book.entity';

@Injectable()
export class BorrowBookService extends SerializeService<BorrowBookEntity> {
    constructor(
        @InjectModel(BorrowBookEntity) private readonly borrowBookModel: ReturnModelType<typeof BorrowBookEntity>,
    ) {
        super(BorrowBookEntity);
    }

    async findOneBorrowedBook(userId: string) {
        const doc = await this.borrowBookModel.findOne({ borrower: userId, isReturned: false });
    }

    async addBorrowedBookDetails(userId: string, bookId: string) {
        const doc = await this.borrowBookModel.create({
            bookId,
            borrower: userId,
            borrowedDate: new Date().toDateString(),
            returnDate: add(new Date(), { days: 30 }),
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
