import { PickType } from '@nestjs/swagger';
import { BookEntity } from '../../admin/admin-book/entities/admin-book.entity';

export class BorrowReturnBookDto extends PickType(BookEntity, ['_id']) {}
