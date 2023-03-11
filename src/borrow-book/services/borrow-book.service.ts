import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { add, intervalToDuration } from 'date-fns';
import { InjectModel } from 'nestjs-typegoose';
import { SerializeService } from '../../../libs/utils/src/serializer/serialize.service';
import { WalletEntity } from '../../wallet/entities/wallet.entity';
import { BorrowBookDto } from '../dto/borrow-book.dto';
import { BorrowBookEntity } from '../entities/borrow-book.entity';

@Injectable()
export class BorrowBookService extends SerializeService<BorrowBookEntity> {
    constructor(
        @InjectModel(BorrowBookEntity) private readonly borrowBookModel: ReturnModelType<typeof BorrowBookEntity>,
        @InjectModel(WalletEntity) private readonly walletModel: ReturnModelType<typeof WalletEntity>,
    ) {
        super(BorrowBookEntity);
    }

    async findBorrowedBooks(userId: string) {
        const docs = await this.borrowBookModel.find({ borrower: userId, isReturned: false }).populate('bookId');

        const borrowedData: any = [];

        docs.forEach((book) => {
            const remainingDays = intervalToDuration({
                start: new Date(),
                end: book.returnDate.toDate(),
            });

            const obj = {
                book: book.bookId,
                remainingDays,
                borrowId: book.id,
            };

            borrowedData.push(obj);
        });

        return this.toJSON(borrowedData, BorrowBookDto);
    }

    async addBorrowedBookDetails(userId: string, bookId: string) {
        const doc = await this.borrowBookModel.create({
            bookId,
            borrower: userId,
            borrowedDate: new Date().toISOString(),
            returnDate: add(new Date(), { days: 15 }).toISOString(),
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

    async extendBorrowedBooksDuration(userId: string, id: string) {
        const doc = await this.borrowBookModel.findOne({ _id: id });

        let rDate = new Date(doc.returnDate);
        rDate = add(rDate, { weeks: 2 });

        doc.returnDate = rDate.toISOString();
        await doc.save();

        const wallet = await this.walletModel.findOneAndUpdate(
            { owner: userId },
            { $inc: { balance: -10 } },
            { new: true },
        );

        return this.toJSON(doc, BorrowBookDto);
    }
}
