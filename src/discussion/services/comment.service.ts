import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SerializeService } from '../../../libs/utils/src/serializer/serialize.service';
import { CommentDto, CreateCommentDto } from '../dto/comment.dto';
import { CommentEntity } from '../entities/comment.entity';
import { DiscussionEntity } from '../entities/discussion.entity';
import { DiscussionService } from './discussion.service';

@Injectable()
export class CommentService extends SerializeService<CommentEntity> {
    constructor(
        @InjectModel(CommentEntity) private readonly commentModel: ReturnModelType<typeof CommentEntity>,
        @InjectModel(DiscussionEntity) private readonly discussionModel: ReturnModelType<typeof DiscussionEntity>,
        private readonly discussionService: DiscussionService,
    ) {
        super(CommentEntity);
    }

    async createComment(userId: string, bookId: string, discussion: string, body: CreateCommentDto) {
        const doc = await this.commentModel.create({
            ...body,
            discussion,
            madeBy: userId,
        });

        await this.discussionService.addCommentToDiscussion(doc._id, discussion);

        return this.toJSON(doc, CommentDto);
    }

    async findComments(userId: string, discussion: string) {
        const docs = await this.commentModel.find({ madeBy: userId, discussion });
        if (!docs) throw new NotFoundException('No comments found');

        return this.toJSON(docs, CommentDto);
    }

    async deleteComment(userId: string, discussion: string, _id: string) {
        const doc = await this.commentModel.findOneAndDelete({ _id, discussion, madeBy: userId });
        console.log('🚀 ~ file: comment.service.ts:41 ~ CommentService ~ deleteComment ~ doc:', doc);
        if (!doc) throw new BadRequestException('This request cannot be completed');

        const disDoc = await this.discussionModel.findOneAndUpdate(
            { discussion },
            { $pull: { comments: { $in: [_id] } } },
            { new: true },
        );

        return true;
    }
}
