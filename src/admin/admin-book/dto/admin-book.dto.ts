import { PartialType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PaginationQueryDto } from '../../../common';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { BookEntity } from './../entities/admin-book.entity';

export class CreateAdminBookDto extends PickType(BookEntity, [
    'author',
    'title',
    'description',

    'quantity',
    'tags',
    'image',
    'shelf',
]) {}

export class UpdateAdminBookDto extends PartialType(CreateAdminBookDto) {}
export class RestockAdminBookDto extends PickType(CreateAdminBookDto, ['quantity']) {}

// query
export class AdminBooksQueryDto extends PaginationQueryDto {}

// response
export class BookDto extends BookEntity {}

export class AdminBooksDto {
    @Expose()
    data: BookDto[];

    @Expose()
    pagination: PaginationDto;
}
