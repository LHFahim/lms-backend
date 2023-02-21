import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { DocumentCTWithTimeStamps, Model } from '../../../libs/utils/src';
import { BookEntity } from '../../admin/admin-book/entities/admin-book.entity';
import { BookTagsEnum } from '../../common/enums/lms.enum';
import { UserEntity } from './user.entity';

@Model('users-interests', true)
export class UserInterestsEntity extends DocumentCTWithTimeStamps {
    @Expose()
    @IsArray()
    @IsNotEmpty()
    @IsEnum(BookTagsEnum, { each: true })
    @Prop({ required: true, default: [] })
    @ApiProperty({ required: true, isArray: true, enum: BookTagsEnum })
    interests: BookTagsEnum[];

    @Expose()
    @IsArray()
    @IsMongoId({ each: true })
    @ApiProperty({ required: true })
    @Prop({ required: true, default: [], ref: () => BookEntity })
    booksRead: Ref<BookEntity>[];

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => UserEntity)
    @Prop({ required: true, ref: () => UserEntity })
    user: Ref<UserEntity>;
}
