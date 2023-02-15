import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Model } from '../../../../libs/utils/src';
import { UserEntity } from '../../../user/entities/user.entity';
import { DocumentCTWithTimeStamps } from './../../../../libs/utils/src/serializer/defaultClasses';

@Model('books', true)
export class BookEntity extends DocumentCTWithTimeStamps {
    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: false })
    @Prop({ required: false, trim: true })
    title: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: false })
    @Prop({ required: false, trim: true })
    author: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: false })
    @Prop({ required: false, trim: true })
    description: string;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: false })
    @Prop({ required: false, trim: true })
    quantity: number;

    @Expose()
    @IsArray()
    @IsOptional()
    @ApiProperty()
    @Prop({ default: [] })
    @IsMongoId({ each: true })
    borrowedBy: Ref<UserEntity>[];

    @Expose()
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ required: false })
    @Prop({ required: false, trim: true })
    isAvailable: boolean;

    @Expose()
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ required: false })
    @Prop({ required: false, trim: true })
    isDeleted: boolean;

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => UserEntity)
    @Prop({ required: true, ref: () => UserEntity })
    createdBy: Ref<UserEntity>;
}
