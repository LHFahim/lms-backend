import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AdminBookController } from './admin-book.controller';
import { AdminBookService } from './admin-book.service';
import { BookEntity } from './entities/admin-book.entity';

@Module({
    imports: [TypegooseModule.forFeature([BookEntity])],
    controllers: [AdminBookController],
    providers: [AdminBookService],
})
export class AdminBookModule {}
