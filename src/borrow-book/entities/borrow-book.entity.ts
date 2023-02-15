import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsMongoId, IsNotEmpty } from 'class-validator';
import { Model } from '../../../libs/utils/src';
import { UserEntity } from '../../user/entities/user.entity';
import { BookEntity } from './../../admin/admin-book/entities/admin-book.entity';

@Model('borrowed books', true)
export class BorrowBookEntity {
    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => BookEntity)
    @Prop({ required: true, ref: () => BookEntity })
    bookId: Ref<BookEntity>;

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => UserEntity)
    @Prop({ required: true, ref: () => UserEntity })
    borrower: Ref<UserEntity>;

    @Expose()
    @IsDateString()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    borrowedDate: string;

    @Expose()
    @IsDateString()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    returnDate: string;

    @Expose()
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, default: false, trim: true })
    isReturned: boolean;
}
