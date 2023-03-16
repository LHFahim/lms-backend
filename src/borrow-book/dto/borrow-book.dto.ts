import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import mongoose from 'mongoose';
import { BookEntity } from '../../admin/admin-book/entities/admin-book.entity';
import { BorrowBookEntity } from '../entities/borrow-book.entity';

export class CreateBorrowBookDto {}
export class UpdateBorrowBookDto extends PartialType(CreateBorrowBookDto) {}

// response
export class BorrowBookDto extends PickType(BorrowBookEntity, ['borrowedDate', 'returnDate', 'isReturned']) {
    @Expose()
    @IsMongoId()
    borrowId: mongoose.Types.ObjectId;

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => BookEntity)
    @ApiProperty({ required: true })
    @Prop({ required: true, ref: () => BookEntity })
    book: Ref<BookEntity>;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true, minimum: 0 })
    remainingDays: number;
}

export class ReturnedBookDto extends BorrowBookEntity {
    // @Expose()
    // @IsMongoId()
    // borrowId: mongoose.Types.ObjectId;
    // @Expose()
    // @IsMongoId()
    // @IsNotEmpty()
    // @Type(() => BookEntity)
    // @ApiProperty({ required: true })
    // @Prop({ required: true, ref: () => BookEntity })
    // book: Ref<BookEntity>;
    // @Expose()
    // @IsNumber()
    // @IsNotEmpty()
    // @ApiProperty({ required: true, minimum: 0 })
    // remainingDays: number;
}
