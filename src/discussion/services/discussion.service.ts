import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SerializeService } from '../../../libs/utils/src/serializer/serialize.service';
import { CreateDiscussionDto, DiscussionDto, UpdateDiscussionDto } from '../dto/discussion.dto';

import { DiscussionEntity } from '../entities/discussion.entity';

@Injectable()
export class DiscussionService extends SerializeService<DiscussionEntity> {
    constructor(
        @InjectModel(DiscussionEntity) private readonly discussionModel: ReturnModelType<typeof DiscussionEntity>,
    ) {
        super(DiscussionEntity);
    }

    async createDiscussion(body: CreateDiscussionDto) {
        const doc = await this.discussionModel.create({
            ...body,
            comments: [],
        });

        return this.toJSON(doc, DiscussionDto);
    }

    async findOneDiscussion(userId: string, book: string, _id: string) {
        const doc = await (await this.discussionModel.findOne({ _id, book })).populate('comments');
        if (!doc) throw new NotFoundException('No discussion record found');

        return this.toJSON(doc, DiscussionDto);
    }

    async addCommentToDiscussion(commentId: string, discussionId: string) {
        const doc = await this.discussionModel.findOneAndUpdate(
            { _id: discussionId },
            { $push: { comments: commentId } },
            { new: true },
        );

        return this.toJSON(doc, DiscussionDto);
    }

    findOne(id: number) {
        return `This action returns a #${id} discussion`;
    }

    update(id: number, updateDiscussionDto: UpdateDiscussionDto) {
        return `This action updates a #${id} discussion`;
    }

    remove(id: number) {
        return `This action removes a #${id} discussion`;
    }
}
