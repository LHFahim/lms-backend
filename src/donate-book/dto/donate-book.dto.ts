import { PartialType, PickType } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common';
import { DonateBookEntity } from '../entities/donate-book.entity';

export class CreateDonateBookDto extends PickType(DonateBookEntity, [
    'title',
    'author',
    'description',
    'image',
    'tags',
]) {}

export class AddDonateBookDto extends CreateDonateBookDto {}

export class UpdateDonateBookDto extends PartialType(CreateDonateBookDto) {}

export class DonateBookDto extends DonateBookEntity {}

export class AdminDonatedBooksQueryDto extends PaginationQueryDto {}
