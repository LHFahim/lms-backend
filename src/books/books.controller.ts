import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../libs/utils/src';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum, Routes } from '../common';
import { ResourceId } from '../common/decorators/params.decorator';
import { BooksService } from './books.service';
import { BookQueryDto, FilteredBooksDto } from './dto/book.dto';

@ApiTags('Books')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.Books, version: APIVersions.V1 })
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Get(Routes[ControllersEnum.Books].findSearchedBooks)
    findSearchedBooks(@UserId() userId: string, @Query() query: BookQueryDto) {
        return this.booksService.findSearchedBooks(userId, query);
    }

    @Get(Routes[ControllersEnum.Books].findBooks)
    findBooks(@UserId() userId: string) {
        return this.booksService.findBooks(userId);
    }
    @Get(Routes[ControllersEnum.Books].findOneBook)
    findOneBook(@UserId() userId: string, @ResourceId() id: string) {
        return this.booksService.findOneBook(userId, id);
    }

    @Patch(Routes[ControllersEnum.Books].borrowOneBook)
    borrowOneBook(@UserId() userId: string, @ResourceId() id: string) {
        return this.booksService.borrowOneBook(userId, id);
    }

    @Patch(Routes[ControllersEnum.Books].returnOneBook)
    returnOneBook(@UserId() userId: string, @ResourceId() id: string) {
        return this.booksService.returnOneBook(userId, id);
    }

    @Post(Routes[ControllersEnum.Books].findFilteredBooks)
    findFilteredBooks(@UserId() userId: string, @Body() body: FilteredBooksDto) {
        return this.booksService.findFilteredBooks(userId, body);
    }
}
