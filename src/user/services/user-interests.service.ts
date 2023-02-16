import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { CategoryEnum } from '../../common/enums/lms.enum';
import { SerializableService } from '../../interfaces/serializable.class';
import { UserInterestsEntity } from '../entities/user-interests.entity';

@Injectable()
export class UserInterestsService extends SerializableService<UserInterestsEntity> {
    constructor(
        @InjectModel(UserInterestsEntity) private readonly interestModel: ReturnModelType<typeof UserInterestsEntity>,
    ) {
        super(UserInterestsEntity);
    }

    async addInterestsToUser(userId: string, bookId: string, interets: CategoryEnum[]) {
        const doc = await this.interestModel.updateOne(
            { user: userId },
            { $addToSet: { interests: { $each: interets }, booksRead: bookId } },
            { upsert: true },
        );

        console.log(doc);
    }
}
