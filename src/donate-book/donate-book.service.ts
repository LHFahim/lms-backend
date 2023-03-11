import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { UserId } from '../../libs/utils/src';
import { SerializeService } from '../../libs/utils/src/serializer/serialize.service';
import { AdminBookService } from '../admin/admin-book/admin-book.service';
import { BookDto } from '../admin/admin-book/dto/admin-book.dto';
import { BookEntity } from '../admin/admin-book/entities/admin-book.entity';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { AddDonateBookDto, CreateDonateBookDto, DonateBookDto } from './dto/donate-book.dto';
import { DonateBookEntity } from './entities/donate-book.entity';

@Injectable()
export class DonateBookService extends SerializeService<DonateBookEntity> {
    constructor(
        @InjectModel(BookEntity) private readonly bookModel: ReturnModelType<typeof BookEntity>,
        @InjectModel(WalletEntity) private readonly walletModel: ReturnModelType<typeof WalletEntity>,
        @InjectModel(DonateBookEntity) private readonly donateModel: ReturnModelType<typeof DonateBookEntity>,
        private readonly bookService: AdminBookService,
    ) {
        super(DonateBookEntity);
    }

    async donateBook(@UserId() userId: string, body: CreateDonateBookDto) {
        const doc = await this.donateModel.create({ ...body, isAccepted: false, donatedBy: userId });

        return this.toJSON(doc, DonateBookDto);
    }

    async findDonatedBooks() {
        const docs = await this.donateModel.find({ isAccepted: false });

        return this.toJSON(docs, DonateBookDto);
    }

    async addDonatedBookToSystem(userId: string, id: string, body: AddDonateBookDto) {
        const doc = await this.bookService.addBook(userId, { ...body, quantity: 1, shelf: 10 });
        if (!doc) throw new BadRequestException("Book couldn't be added!");

        const donateDoc = await this.donateModel.findOneAndUpdate(
            { _id: id, isAccepted: false },
            { isAccepted: true },
            { new: true },
        );

        const wallet = await this.walletModel.findOneAndUpdate(
            { owner: donateDoc.donatedBy },
            { $inc: { balance: 5 } },
            { new: true },
        );

        return this.toJSON(doc, BookDto);
    }
}
