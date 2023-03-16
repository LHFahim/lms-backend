import { Controller, Get, UseGuards } from '@nestjs/common';
import { Patch } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize } from '../../../libs/utils/src';
import { ResourceId } from '../../../libs/utils/src/request/validate-resource-ids.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum, Routes } from '../../common';
import { UserId } from '../../common/decorators/user.decorator';
import { BorrowBookService } from '../services/borrow-book.service';

@ApiTags('Borrow Books')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.BorrowBooks, version: APIVersions.V1 })
export class BorrowBookController {
    constructor(private readonly borrowBookService: BorrowBookService) {}

    @Get(Routes[ControllersEnum.BorrowBooks].findBorrowedBooks)
    findBorrowedBooks(@UserId() userId: string) {
        return this.borrowBookService.findBorrowedBooks(userId);
    }

    @Get(Routes[ControllersEnum.BorrowBooks].findReturnedBooks)
    findReturnedBooks(@UserId() userId: string) {
        return this.borrowBookService.findReturnedBooks(userId);
    }

    @Patch(Routes[ControllersEnum.BorrowBooks].extendBorrowedBooksDuration)
    extendBorrowedBooksDuration(@UserId() userId: string, @ResourceId() id: string) {
        return this.borrowBookService.extendBorrowedBooksDuration(userId, id);
    }

    // i have made this route automated using crone,
    // currently this endpoint is useless
    @Patch(Routes[ControllersEnum.BorrowBooks].extendBorrowedBooksLimit)
    extendBorrowedBooksLimit(@UserId() userId: string) {
        return this.borrowBookService.extendBorrowedBooksLimit();
    }
}
