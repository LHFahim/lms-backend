import { PartialType, PickType } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { DonateBookEntity } from '../entities/donate-book.entity';

export class CreateDonateBookDto extends PickType(DonateBookEntity, [
    'title',
    'author',
    'description',
    'image',
    'tags',
]) {}

export class AddDonateBookDto extends CreateDonateBookDto {
    @IsMongoId()
    @IsNotEmpty()
    id: string;
}

export class UpdateDonateBookDto extends PartialType(CreateDonateBookDto) {}

export class DonateBookDto extends DonateBookEntity {}
