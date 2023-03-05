import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../../libs/utils/src';
import { ResourceId } from '../../../libs/utils/src/request/validate-resource-ids.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum, Routes } from '../../common';
import { BorrowRequestService } from '../services/borrow-request.service';

@ApiTags('Borrow Request')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.BorrowRequestBooks, version: APIVersions.V1 })
export class BorrowRequestController {
    constructor(private readonly borrowRequestService: BorrowRequestService) {}

    @Post(Routes[ControllersEnum.BorrowRequestBooks].requestToBorrow)
    requestToBorrow(@UserId() userId: string, @ResourceId('bookId') bookId: string) {
        return this.borrowRequestService.requestToBorrow(userId, bookId);
    }

    @Get(Routes[ControllersEnum.BorrowRequestBooks].findAllBorrowedRequests)
    findAllBorrowedRequests(@UserId() userId: string) {
        return this.borrowRequestService.findAllBorrowedRequests(userId);
    }
}
