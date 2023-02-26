import { SerializeService } from '@app/utils/serializer/serialize.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { DiscussionService } from '../../discussion/services/discussion.service';

import { UserEntity } from '../../user/entities/user.entity';

import { AdminAuthService } from '../admin-auth/auth.service';
import { BookDto, CreateAdminBookDto, RestockAdminBookDto, UpdateAdminBookDto } from './dto/admin-book.dto';
import { BookEntity } from './entities/admin-book.entity';

@Injectable()
export class AdminBookService extends SerializeService<BookEntity> {
    constructor(
        @InjectModel(BookEntity) private readonly bookModel: ReturnModelType<typeof BookEntity>,
        @InjectModel(UserEntity) private readonly userModel: ReturnModelType<typeof UserEntity>,
        private adminAuthService: AdminAuthService,
        private readonly discussionService: DiscussionService,
    ) {
        super(BookEntity);
    }

    async addBook(userId: string, body: CreateAdminBookDto) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const doc = await this.bookModel.create({
            ...body,

            borrowedBy: [],
            isAvailable: true,
            isDeleted: false,
            addedBy: userId,
        });

        await this.discussionService.createDiscussion({ book: doc._id });

        return this.toJSON(doc, BookDto);
    }

    async findBooks(userId: string) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const docs = await this.bookModel.find({ isAvailable: true, isDeleted: false });
        if (!docs) throw new NotFoundException('No book is found');

        return this.toJSONs(docs, BookDto);
    }

    async findOne(userId: string, _id: string) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const doc = await this.bookModel.findOne({ _id });

        if (!doc) throw new NotFoundException('No book is found');

        return this.toJSON(doc, BookDto);
    }

    async updateOneBook(userId: string, _id: string, body: UpdateAdminBookDto) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const doc = await this.bookModel.findOneAndUpdate({ _id }, body, { new: true });

        if (!doc) throw new NotFoundException('No book is found');

        return this.toJSON(doc, BookDto);
    }

    async deleteOneBook(userId: string, _id: string) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const doc = await this.bookModel.findOneAndUpdate(
            { _id },
            { isAvailable: false, isDeleted: true },
            { new: true },
        );

        if (!doc) throw new NotFoundException('No book is found');

        return this.toJSON(doc, BookDto);
    }

    async restockOneBook(userId: string, _id: string, body: RestockAdminBookDto) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const doc = await this.bookModel.findOneAndUpdate({ _id }, { quantity: body.quantity }, { new: true });

        if (!doc) throw new NotFoundException('No book is found');

        return this.toJSON(doc, BookDto);
    }
}
