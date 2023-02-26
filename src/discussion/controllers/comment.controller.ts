import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Routes } from 'src/common';
import { Serialize, UserId } from '../../../libs/utils/src';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum } from '../../common';
import { ResourceId } from '../../common/decorators/params.decorator';
import { CreateCommentDto } from '../dto/comment.dto';
import { CommentService } from '../services/comment.service';

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
        @ResourceId('discussionId') discussionId: string,
        @Body() body: CreateCommentDto,
    ) {
        return this.commentService.createComment(userId, discussionId, body);
    }

    @Get(Routes[ControllersEnum.Comment].findComments)
    findComments(@UserId() userId: string, @ResourceId('discussionId') discussionId: string) {
        return this.commentService.findComments(userId, discussionId);
    }
}
