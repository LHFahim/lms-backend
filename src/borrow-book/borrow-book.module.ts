import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { BorrowBookController } from './borrow-book.controller';
import { BorrowBookService } from './borrow-book.service';
import { BorrowBookEntity } from './entities/borrow-book.entity';

@Module({
    imports: [TypegooseModule.forFeature([BorrowBookEntity])],
    controllers: [BorrowBookController],
    providers: [BorrowBookService],
})
export class BorrowBookModule {}
