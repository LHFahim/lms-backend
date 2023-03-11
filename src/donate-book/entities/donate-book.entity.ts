import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { DocumentCTWithTimeStamps, Model } from '../../../libs/utils/src';
import { BookTagsEnum } from '../../common/enums/lms.enum';
import { UserEntity } from '../../user/entities/user.entity';

@Model('donate-books', true)
export class DonateBookEntity extends DocumentCTWithTimeStamps {
    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    title: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: false })
    @Prop({ required: true, trim: true })
    author: string;

    @Expose()
    @IsEnum(BookTagsEnum, { each: true })
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({ required: true, isArray: true, enum: BookTagsEnum })
    @Prop({ required: true, default: BookTagsEnum.ACADEMIC })
    tags: BookTagsEnum[];

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    description: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    image: string;

    @Expose()
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    isAccepted: boolean;

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => UserEntity)
    @Prop({ required: true, ref: () => UserEntity })
    donatedBy: Ref<UserEntity>;
}
