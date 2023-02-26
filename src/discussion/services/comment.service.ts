import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SerializeService } from '../../../libs/utils/src/serializer/serialize.service';
import { CommentDto, CreateCommentDto } from '../dto/comment.dto';
import { CommentEntity } from '../entities/comment.entity';
import { DiscussionService } from './discussion.service';

@Injectable()
export class CommentService extends SerializeService<CommentEntity> {
    constructor(
        @InjectModel(CommentEntity) private readonly commentModel: ReturnModelType<typeof CommentEntity>,
        private readonly discussionService: DiscussionService,
    ) {
        super(CommentEntity);
    }

    async createComment(userId: string, discussion: string, body: CreateCommentDto) {
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
}
