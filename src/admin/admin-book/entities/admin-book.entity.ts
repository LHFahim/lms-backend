import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Model } from '../../../../libs/utils/src';
import { CategoryEnum, CurrencyEnum } from '../../../common/enums/lms.enum';
import { UserEntity } from '../../../user/entities/user.entity';

import { DocumentCTWithTimeStamps } from './../../../../libs/utils/src/serializer/defaultClasses';

@Model('books', true)
export class BookEntity extends DocumentCTWithTimeStamps {
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
    @IsEnum(CategoryEnum, { each: true })
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({ required: true, isArray: true, enum: CategoryEnum })
    @Prop({ required: true, default: CategoryEnum.ACADEMIC })
    category: CategoryEnum[];

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    description: string;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: false, minimum: 0 })
    @Prop({ required: false, trim: true, min: 0 })
    cost: number;

    @Expose()
    @IsEnum(CurrencyEnum)
    @IsNotEmpty()
    @ApiProperty({ required: false })
    @Prop({ required: false })
    currency: CurrencyEnum;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true, minimum: 0 })
    @Prop({ required: true, trim: true, min: 0 })
    quantity: number;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    image: string;

    @Expose()
    @IsArray()
    @ApiProperty({ required: true })
    @Prop({ required: true, default: [] })
    @IsMongoId({ each: true })
    borrowedBy: Ref<UserEntity>[];

    @Expose()
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    isAvailable: boolean;

    @Expose()
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    isDeleted: boolean;

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => UserEntity)
    @Prop({ required: true, ref: () => UserEntity })
    addedBy: Ref<UserEntity>;
}
