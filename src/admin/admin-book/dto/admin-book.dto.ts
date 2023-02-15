import { PartialType, PickType } from '@nestjs/swagger';
import { BookEntity } from './../entities/admin-book.entity';

export class CreateAdminBookDto extends PickType(BookEntity, ['author', 'title', 'description', 'quantity']) {}

export class UpdateAdminBookDto extends PartialType(CreateAdminBookDto) {}

// response
export class BookDto extends BookEntity {}
