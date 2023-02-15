import { Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../libs/utils/src';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum, Routes } from '../common';
import { ResourceId } from '../common/decorators/params.decorator';
import { BooksService } from './books.service';

@ApiTags('Books')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.Books, version: APIVersions.V1 })
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Patch(Routes[ControllersEnum.Books].borrowOneBook)
    borrowOneBook(@UserId() userId: string, @ResourceId() id: string) {
        return this.booksService.borrowOneBook(userId, id);
    }

    @Patch(Routes[ControllersEnum.Books].returnOneBook)
    returnOneBook(@UserId() userId: string, @ResourceId() id: string) {
        return this.booksService.returnOneBook(userId, id);
    }
}
