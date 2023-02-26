import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { DocumentCTWithTimeStamps, Model } from '../../../libs/utils/src';
import { BookEntity } from '../../admin/admin-book/entities/admin-book.entity';
import { CommentEntity } from './comment.entity';

@Model('disucssions', true)
export class DiscussionEntity extends DocumentCTWithTimeStamps {
    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => BookEntity)
    @Prop({ required: true, ref: () => BookEntity })
    book: Ref<BookEntity>;

    @Expose()
    @IsArray()
    @IsMongoId({ each: true })
    @ApiProperty({ required: true })
    @Type(() => CommentEntity)
    @Prop({ required: true, ref: () => CommentEntity, default: [] })
    comments: Ref<CommentEntity>[];
}
