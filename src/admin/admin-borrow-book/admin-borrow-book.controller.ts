import { Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../../libs/utils/src';
import { ResourceId } from '../../../libs/utils/src/request/validate-resource-ids.decorator';
import { APIVersions, ControllersEnum, Routes } from '../../common';
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard';
import { AdminBorrowBookService } from './admin-borrow-book.service';

@ApiTags('Admin ===> Borrow Books')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.AdminBorrowBooks, version: APIVersions.V1 })
export class AdminBorrowBookController {
    constructor(private readonly adminBorrowBookService: AdminBorrowBookService) {}

    @Get(Routes[ControllersEnum.AdminBorrowBooks].findAllBorrowedBooks)
    findAllBorrowedBooks(@UserId() userId: string) {
        return this.adminBorrowBookService.findAllBorrowedBooks(userId);
    }

    @Patch(Routes[ControllersEnum.AdminBorrowBooks].acceptReturnBook)
    acceptReturnBook(
        @UserId() userId: string,
        @ResourceId('bookId') bookId: string,
        @ResourceId('borrowerId') borrowerId: string,
    ) {
        return this.adminBorrowBookService.acceptReturnBook(userId, bookId, borrowerId);
    }

    @Patch(Routes[ControllersEnum.AdminBorrowBooks].approveRequest)
    approveRequest(
        @UserId() userId: string,
        @ResourceId('bookId') bookId: string,
        @ResourceId('requesterId') requesterId: string,
    ) {
        return this.adminBorrowBookService.approveRequest(userId, bookId, requesterId);
    }

    @Delete(Routes[ControllersEnum.AdminBorrowBooks].declineRequest)
    declineRequest(
        @UserId() userId: string,
        @ResourceId('bookId') bookId: string,
        @ResourceId('requesterId') requesterId: string,
    ) {
        return this.adminBorrowBookService.declineRequest(userId, bookId, requesterId);
    }
}
