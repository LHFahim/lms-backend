import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Routes } from 'src/common';
import { Serialize, UserId } from '../../../libs/utils/src';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum } from '../../common';
import { CreateCommentDto } from '../dto/comment.dto';
import { CommentService } from '../services/comment.service';
import { ResourceId } from './../../../libs/utils/src/request/validate-resource-ids.decorator';

@ApiTags('Comments')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.Comment, version: APIVersions.V1 })
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post(Routes[ControllersEnum.Comment].createComment)
    createComment(
        @UserId() userId: string,
        @ResourceId('bookId') bookId: string,
        @ResourceId('discussionId') discussionId: string,
        @Body() body: CreateCommentDto,
    ) {
        return this.commentService.createComment(userId, bookId, discussionId, body);
    }

    @Get(Routes[ControllersEnum.Comment].findComments)
    findComments(@UserId() userId: string, @ResourceId('discussionId') discussionId: string) {
        return this.commentService.findComments(userId, discussionId);
    }

    @Delete(Routes[ControllersEnum.Comment].deleteComment)
    deleteComment(
        @UserId() userId: string,
        @ResourceId('discussionId') discussionId: string,
        @ResourceId() id: string,
    ) {
        return this.commentService.deleteComment(userId, discussionId, id);
    }
}
