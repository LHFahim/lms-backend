import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../../libs/utils/src';
import { ResourceId } from '../../../libs/utils/src/request/validate-resource-ids.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum, Routes } from '../../common';
import { CreateDiscussionDto } from '../dto/discussion.dto';
import { DiscussionService } from '../services/discussion.service';

@ApiTags('Discussions')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.Discussion, version: APIVersions.V1 })
export class DiscussionController {
    constructor(private readonly discussionService: DiscussionService) {}

    @Post(Routes[ControllersEnum.Discussion].createDiscussion)
    createDiscussion(@Body() body: CreateDiscussionDto) {
        return this.discussionService.createDiscussion(body);
    }

    @Get(Routes[ControllersEnum.Discussion].findOneDiscussion)
    findOneDiscussion(@UserId() userId: string, @ResourceId('bookId') bookId: string) {
        return this.discussionService.findOneDiscussion(userId, bookId);
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.discussionService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateDiscussionDto: UpdateDiscussionDto) {
    //     return this.discussionService.update(+id, updateDiscussionDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.discussionService.remove(+id);
    // }
}
