import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BookEntity } from '../../admin/admin-book/entities/admin-book.entity';
import { BookTagsEnum } from '../../common/enums/lms.enum';
import { SerializableService } from '../../interfaces/serializable.class';
import { UserInterestsEntity } from '../entities/user-interests.entity';

@Injectable()
export class UserInterestsService extends SerializableService<UserInterestsEntity> {
    constructor(
        @InjectModel(UserInterestsEntity) private readonly interestModel: ReturnModelType<typeof UserInterestsEntity>,
        @InjectModel(BookEntity) private readonly bookModel: ReturnModelType<typeof BookEntity>,
    ) {
        super(UserInterestsEntity);
    }

    async findUserInterests(userId: string) {
        const doc = await this.interestModel.findOne({ user: userId }).populate('booksRead', '', 'BookEntity');
        if (!doc) throw new NotFoundException('No user interests is found');

        const interestsFromPrevBooks = doc.interests;
        const alreadyReadBookIds = doc.booksRead.map((el) => el._id);

        const moreSimilarBooks = await this.bookModel.find({
            $and: [{ tags: { $in: interestsFromPrevBooks }, isAvailable: true }, { _id: { $nin: alreadyReadBookIds } }],
        });

        const lastReadBookIndex = doc.booksRead.length;
        const bookPreviouslyRead: any = doc.booksRead[lastReadBookIndex - 1];

        const prevBookTags = (bookPreviouslyRead as BookEntity).tags;

        let bookToShow;
        for (let i = 0; i < moreSimilarBooks.length; i++) {
            const temp = moreSimilarBooks[i].tags.map((tag) => prevBookTags.includes(tag));
            if (temp.length > 0) bookToShow = moreSimilarBooks[i];

            break;
        }

        return {
            userInterests: doc.toJSON(),
            moreSimilarBooks: moreSimilarBooks.map((el) => el.toObject()),
            previousRead: bookPreviouslyRead.toJSON(),
            recommendedBook: bookToShow.toJSON(),
        };
    }

    async addInterestsToUser(userId: string, bookId: string, interets: BookTagsEnum[]) {
        const doc = await this.interestModel.updateOne(
            { user: userId },
            { $addToSet: { interests: { $each: interets }, booksRead: bookId } },
            { upsert: true },
        );
    }

    shuffle(array) {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }
}
