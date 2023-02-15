import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Model } from '../../../../libs/utils/src';
import { UserEntity } from '../../../user/entities/user.entity';
import { CurrencyEnum } from '../../../wallet/entities/wallet.entity';
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
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    description: string;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true, minimum: 0 })
    @Prop({ required: true, trim: true, min: 0 })
    cost: number;

    @Expose()
    @IsEnum(CurrencyEnum)
    @IsNotEmpty()
    @ApiProperty({ required: true, default: CurrencyEnum.BDT })
    @Prop({ required: true, default: CurrencyEnum.BDT })
    currency: CurrencyEnum;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true, minimum: 0 })
    @Prop({ required: true, trim: true, min: 0 })
    quantity: number;

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
