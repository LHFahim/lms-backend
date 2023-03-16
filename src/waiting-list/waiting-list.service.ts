import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SerializeService } from '../../libs/utils/src/serializer/serialize.service';
import { BookEntity } from '../admin/admin-book/entities/admin-book.entity';
import { UserEntity } from '../user/entities/user.entity';
import { WaitingListDto } from './dto/waiting-list.dto';
import { WaitingListEntity } from './entities/waiting-list.entity';

@Injectable()
export class WaitingListService extends SerializeService<WaitingListEntity> {
    constructor(
        @InjectModel(WaitingListEntity) private readonly waitingModel: ReturnModelType<typeof WaitingListEntity>,
        @InjectModel(UserEntity) private readonly userModel: ReturnModelType<typeof UserEntity>,
        @InjectModel(BookEntity) private readonly bookModel: ReturnModelType<typeof BookEntity>,
        private readonly mailService: MailerService,
    ) {
        super(WaitingListEntity);
    }

    async createWaitingList(user: string, book: string) {
        const flag = await this.waitingModel.findOne({ user, book, isEmailed: false });
        if (flag) throw new BadRequestException('You have already joined waiting list!');

        const doc = await this.waitingModel.create({ user, book, isEmailed: false });

        return this.toJSON(doc, WaitingListDto);
    }

    @Cron(CronExpression.EVERY_10_HOURS, {
        name: 'Cron job from Book Service',
    })
    async handleBorrowBookCron() {
        console.log('this is cron at every 10 seconds');

        const docs = await this.waitingModel
            .find({ isEmailed: false })
            .populate({ path: 'book', match: { quantity: { $gt: 0 } } })
            .populate('user');

        docs.forEach(async (data) => {
            const { book, user } = data;

            if (!book) return;

            const userEmail = (user as UserEntity).email;
            const title = (book as BookEntity).title;
            const author = (book as BookEntity).author;

            const res = await this.mailService.sendMail({
                to: userEmail,
                // to: 'wangnana_5@aliyun.com',
                from: process.env.SEND_GRID_SENDER_EMAIL,
                subject: 'Book availability',
                text: `Dear reader. ${'\n'}You joined waiting list for the book titled ${title} by ${author}. The book has become available. Please come to the library as soon as possible. ${'\n'}Regards, ${'\n'}${'\n'}Fahim,${'\n'}Online Library Management System`,
            });
        });
    }
}
