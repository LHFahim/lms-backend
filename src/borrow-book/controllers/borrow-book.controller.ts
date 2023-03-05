import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize } from '../../../libs/utils/src';
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
}
