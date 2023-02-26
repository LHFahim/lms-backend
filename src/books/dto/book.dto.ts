import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { BookEntity } from '../../admin/admin-book/entities/admin-book.entity';

export class BorrowReturnBookDto extends PickType(BookEntity, ['_id']) {}
export class FilteredBooksDto extends PickType(BookEntity, ['tags']) {}

export class BookQueryDto {
    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    key: string;
}
