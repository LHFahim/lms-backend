import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CommentController } from './controllers/comment.controller';
import { DiscussionController } from './controllers/discussion.controller';
import { CommentEntity } from './entities/comment.entity';
import { DiscussionEntity } from './entities/discussion.entity';
import { CommentService } from './services/comment.service';
import { DiscussionService } from './services/discussion.service';

@Module({
    imports: [TypegooseModule.forFeature([DiscussionEntity, CommentEntity])],
    controllers: [DiscussionController, CommentController],
    providers: [DiscussionService, CommentService],
    exports: [DiscussionService],
})
export class DiscussionModule {}
