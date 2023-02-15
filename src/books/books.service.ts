import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BookDto } from '../admin/admin-book/dto/admin-book.dto';
import { BookEntity } from '../admin/admin-book/entities/admin-book.entity';
import { SerializableService } from '../interfaces/serializable.class';
import { UserEntity } from '../user/entities/user.entity';
import { BorrowBookService } from './../borrow-book/borrow-book.service';

@Injectable()
export class BooksService extends SerializableService<BookEntity> {
    constructor(
        @InjectModel(BookEntity) private readonly bookModel: ReturnModelType<typeof BookEntity>,
        @InjectModel(UserEntity) private readonly userModel: ReturnModelType<typeof UserEntity>,
        private readonly borrowBookService: BorrowBookService,
    ) {
        super(BookEntity);
    }

    async borrowOneBook(userId: string, _id: string) {
        const existingDoc = await this.bookModel.findOne({
            _id,
            isAvailable: true,
            isDeleted: false,
            quantity: { $gt: 0 },
        });

        if (!existingDoc) throw new NotFoundException('Book was not found');

        let flag = false;

        for (let i = 0; i < existingDoc.borrowedBy.length; i++) {
            if (existingDoc.borrowedBy[i].toString() === userId) {
                flag = true;
                break;
            }
        }
        if (flag) throw new BadRequestException('You have already borrowed this book');

        const doc = await this.bookModel.findOneAndUpdate(
            { _id, isAvailable: true, isDeleted: false, quantity: { $gt: 0 } },
            { $inc: { quantity: -1 }, $addToSet: { borrowedBy: userId } },
            { new: true },
        );
        if (!doc) throw new BadRequestException('Request cannot be completed');

        await this.borrowBookService.addBorrowedBookDetails(userId, _id);

        return this.toJSON(doc, BookDto);
    }

    async returnOneBook(userId: string, _id: string) {
        const doc = await this.bookModel.findOne({ _id, isAvailable: true, isDeleted: false });
        if (!doc) throw new BadRequestException('Request cannot be completed');

        const newBorrow = doc.borrowedBy.filter((el) => el.toString() !== userId);

        doc.borrowedBy = newBorrow;

        await doc.save();

        await this.borrowBookService.changeStatusForBorrowedBook(userId, _id);

        return this.toJSON(doc, BookDto);
    }
}
