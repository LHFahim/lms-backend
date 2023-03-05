import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SerializeService } from '../../../libs/utils/src/serializer/serialize.service';
import { BorrowRequestDto } from '../dto/borrow-request.dto';
import { BorrowRequestEntity } from '../entities/borrow-request.entity';

@Injectable()
export class BorrowRequestService extends SerializeService<BorrowRequestEntity> {
    constructor(
        @InjectModel(BorrowRequestEntity)
        private readonly borrowRequestModel: ReturnModelType<typeof BorrowRequestEntity>,
    ) {
        super(BorrowRequestEntity);
    }

    async requestToBorrow(userId: string, book: string) {
        const flag = await this.borrowRequestModel.findOne({ book, requester: userId, isDeleted: false });

        if (flag) throw new BadRequestException('This reqquest cannot be completed.');

        const doc = await this.borrowRequestModel.create({
            book,
            requester: userId,
            isApproved: false,
            isDisapproved: false,
            isDeleted: false,
        });

        return this.toJSON(doc, BorrowRequestDto);
    }

    async findAllBorrowedRequests(userId: string) {
        const docs = await this.borrowRequestModel.find({ isApproved: false }).populate('book').populate('requester');

        return this.toJSON(docs, BorrowRequestDto);
    }
}
