import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { BorrowBookEntity } from '../../../borrow-book/entities/borrow-book.entity';
import { PaginationQueryDto } from '../../../common';
import { UserEntity } from '../../../user/entities/user.entity';
import { BookEntity } from '../../admin-book/entities/admin-book.entity';

export class AdminBorrowBookDto extends BorrowBookEntity {}

export class AdminBorrowBookAggregationDto {
    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => BookEntity)
    @Prop({ required: true, ref: () => BookEntity })
    book: Ref<BookEntity>;

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => UserEntity)
    @Prop({ required: true, ref: () => UserEntity })
    borrower: Ref<UserEntity>;
}

// query
export class AdminBorrowBooksQueryDto extends PaginationQueryDto {}
