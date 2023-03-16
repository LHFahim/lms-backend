import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BookDto } from '../admin/admin-book/dto/admin-book.dto';
import { BookEntity } from '../admin/admin-book/entities/admin-book.entity';
import { BorrowBookService } from '../borrow-book/services/borrow-book.service';
import { SerializableService } from '../interfaces/serializable.class';
import { UserEntity } from '../user/entities/user.entity';
import { UserInterestsService } from '../user/services/user-interests.service';
import { WalletService } from '../wallet/wallet.service';
import { BookQueryDto, FilteredBooksDto } from './dto/book.dto';

@Injectable()
export class BooksService extends SerializableService<BookEntity> {
    constructor(
        @InjectModel(BookEntity) private readonly bookModel: ReturnModelType<typeof BookEntity>,
        @InjectModel(UserEntity) private readonly userModel: ReturnModelType<typeof UserEntity>,
        private readonly borrowBookService: BorrowBookService,
        private readonly walletService: WalletService,
        private readonly interestService: UserInterestsService,
    ) {
        super(BookEntity);
    }

    async findBooks(userId: string) {
        const docs = await this.bookModel.find();
        return this.toJSON(docs, BookDto);
    }

    async findOneBook(userId: string, _id: string) {
        const doc = await this.bookModel.findOne({ _id });
        return this.toJSON(doc, BookDto);
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

        await this.interestService.addInterestsToUser(userId, doc._id, doc.tags);

        return this.toJSON(doc, BookDto);
    }

    async returnOneBook(userId: string, _id: string) {
        const doc = await this.bookModel.findOne({ _id, isAvailable: true, isDeleted: false });
        if (!doc) throw new BadRequestException('Request cannot be completed');

        const newBorrow = doc.borrowedBy.filter((el) => el.toString() !== userId);

        doc.borrowedBy = newBorrow;
        doc.quantity++;

        await doc.save();

        await this.borrowBookService.changeStatusForBorrowedBook(userId, _id);

        return this.toJSON(doc, BookDto);
    }

    async findFilteredBooks(userId: string, body: FilteredBooksDto) {
        const docs = await this.bookModel.find({ tags: { $all: body.tags } });

        return this.toJSON(docs, BookDto);
    }

    async findSearchedBooks(userId: string, query: BookQueryDto) {
        const { key } = query;

        const docs = await this.bookModel.find({
            $or: [
                {
                    title: { $regex: key, $options: 'i' },
                },
                {
                    author: { $regex: key, $options: 'i' },
                },
                {
                    description: { $regex: key, $options: 'i' },
                },
            ],
        });
        return this.toJSON(docs, BookDto);
    }
}
