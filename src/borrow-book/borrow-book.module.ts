import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { BorrowBookController } from './controllers/borrow-book.controller';
import { BorrowRequestController } from './controllers/borrow-request.controller';
import { BorrowBookEntity } from './entities/borrow-book.entity';
import { BorrowRequestEntity } from './entities/borrow-request.entity';
import { BorrowBookService } from './services/borrow-book.service';
import { BorrowRequestService } from './services/borrow-request.service';

@Module({
    imports: [TypegooseModule.forFeature([BorrowBookEntity, BorrowRequestEntity])],
    controllers: [BorrowBookController, BorrowRequestController],
    providers: [BorrowBookService, BorrowRequestService],
})
export class BorrowBookModule {}
