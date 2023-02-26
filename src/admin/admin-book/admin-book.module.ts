import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { DiscussionEntity } from '../../discussion/entities/discussion.entity';
import { DiscussionService } from '../../discussion/services/discussion.service';
import { UserEntity } from '../../user/entities/user.entity';
import { AdminBookController } from './admin-book.controller';
import { AdminBookService } from './admin-book.service';
import { BookEntity } from './entities/admin-book.entity';

@Module({
    imports: [TypegooseModule.forFeature([BookEntity, UserEntity, DiscussionEntity])],
    controllers: [AdminBookController],
    providers: [AdminBookService, DiscussionService],
})
export class AdminBookModule {}
