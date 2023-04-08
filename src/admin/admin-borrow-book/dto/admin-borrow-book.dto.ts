import { BorrowBookEntity } from '../../../borrow-book/entities/borrow-book.entity';
import { PaginationQueryDto } from '../../../common';

export class AdminBorrowBookDto extends BorrowBookEntity {}

// query
export class AdminBorrowBooksQueryDto extends PaginationQueryDto {}
