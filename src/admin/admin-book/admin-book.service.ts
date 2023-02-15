import { SerializeService } from '@app/utils/serializer/serialize.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BookDto, CreateAdminBookDto, UpdateAdminBookDto } from './dto/admin-book.dto';
import { BookEntity } from './entities/admin-book.entity';

@Injectable()
export class AdminBookService extends SerializeService<BookEntity> {
    constructor(@InjectModel(BookEntity) private readonly bookModel: ReturnModelType<typeof BookEntity>) {
        super(BookEntity);
    }

    async addBook(userId: string, body: CreateAdminBookDto) {
        const doc = await this.bookModel.create({
            ...body,
            borrowedBy: [],
            isAvailable: true,
            isDeleted: false,
            createdBy: userId,
        });

        return this.toJSON(doc, BookDto);
    }

    async findBooks(userId: string) {
        const docs = await this.bookModel.find({ isAvailable: true, isDeleted: false });

        return this.toJSONs(docs, BookDto);
    }

    async findOne(userId: string, _id: string) {
        const doc = await this.bookModel.findOne({ _id });

        if (!doc) throw new NotFoundException('No book is found');

        return this.toJSON(doc, BookDto);
    }

    async updateOneBook(userId: string, _id: string, body: UpdateAdminBookDto) {
        const doc = await this.bookModel.findOneAndUpdate({ _id }, body, { new: true });

        if (!doc) throw new NotFoundException('No book is found');

        return this.toJSON(doc, BookDto);
    }

    async deleteOneBook(userId: string, _id: string) {
        const doc = await this.bookModel.findOneAndUpdate(
            { _id },
            { isAvailable: false, isDeleted: true },
            { new: true },
        );

        if (!doc) throw new NotFoundException('No book is found');

        return this.toJSON(doc, BookDto);
    }
}

// {
//     "title": "string",
//     "author": "string",
//     "description": "string",
//     "quantity": 10
// }
