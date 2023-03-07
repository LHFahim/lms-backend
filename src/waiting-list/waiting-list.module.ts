import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { BookEntity } from '../admin/admin-book/entities/admin-book.entity';
import { UserEntity } from '../user/entities/user.entity';
import { WaitingListEntity } from './entities/waiting-list.entity';
import { WaitingListController } from './waiting-list.controller';
import { WaitingListService } from './waiting-list.service';

@Module({
    imports: [TypegooseModule.forFeature([WaitingListEntity, UserEntity, BookEntity])],
    controllers: [WaitingListController],
    providers: [WaitingListService],
})
export class WaitingListModule {}
