import { PickType } from '@nestjs/swagger';
import { CommentEntity } from './../entities/comment.entity';

export class CreateCommentDto extends PickType(CommentEntity, ['comment']) {}

// response
export class CommentDto extends CommentEntity {}
