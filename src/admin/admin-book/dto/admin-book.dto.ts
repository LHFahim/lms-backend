import { PartialType, PickType } from '@nestjs/swagger';
import { BookEntity } from './../entities/admin-book.entity';

export class CreateAdminBookDto extends PickType(BookEntity, [
    'author',
    'title',
    'description',
    'cost',
    'currency',
    'quantity',
]) {}

export class UpdateAdminBookDto extends PartialType(CreateAdminBookDto) {}
export class RestockAdminBookDto extends PickType(CreateAdminBookDto, ['quantity']) {}

// response
export class BookDto extends BookEntity {}
