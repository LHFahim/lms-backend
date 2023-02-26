import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DocumentCTWithTimeStamps, Model } from '../../../libs/utils/src';
import { UserEntity } from '../../user/entities/user.entity';
import { DiscussionEntity } from './discussion.entity';

@Model('comments', true)
export class CommentEntity extends DocumentCTWithTimeStamps {
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: false, minimum: 0, default: 0 })
    @Prop({ required: true, trim: true, min: 0, default: 0 })
    rating: number;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    comment: string;

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => UserEntity)
    @Prop({ required: true, ref: () => UserEntity })
    madeBy: Ref<UserEntity>;

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => DiscussionEntity)
    @Prop({ required: true, ref: () => DiscussionEntity })
    discussion: Ref<DiscussionEntity>;
}
