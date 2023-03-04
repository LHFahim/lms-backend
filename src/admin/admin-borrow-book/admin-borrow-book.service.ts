import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BorrowBookEntity } from '../../borrow-book/entities/borrow-book.entity';
import { SerializableService } from '../../interfaces/serializable.class';
import { AdminAuthService } from '../admin-auth/auth.service';
import { BookEntity } from '../admin-book/entities/admin-book.entity';
import { AdminBorrowBookDto } from './dto/admin-borrow-book.dto';

@Injectable()
export class AdminBorrowBookService extends SerializableService<BorrowBookEntity> {
    constructor(
        @InjectModel(BorrowBookEntity) private readonly borrowBookModel: ReturnModelType<typeof BorrowBookEntity>,
        @InjectModel(BookEntity) private readonly bookModel: ReturnModelType<typeof BookEntity>,
        private readonly adminAuthService: AdminAuthService,
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
}
