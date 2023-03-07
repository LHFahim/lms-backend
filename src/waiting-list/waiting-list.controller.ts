import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../libs/utils/src';
import { ResourceId } from '../../libs/utils/src/request/validate-resource-ids.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum, Routes } from '../common';

import { WaitingListService } from './waiting-list.service';

@ApiTags('Waiting list')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.WaitingList, version: APIVersions.V1 })
export class WaitingListController {
    constructor(private readonly waitingListService: WaitingListService) {}

    @Post(Routes[ControllersEnum.WaitingList].createWaitingList)
    createWaitingList(@UserId() userId: string, @ResourceId('bookId') bookId: string) {
        return this.waitingListService.createWaitingList(userId, bookId);
    }
}
