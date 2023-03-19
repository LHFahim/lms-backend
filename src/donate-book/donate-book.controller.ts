import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../libs/utils/src';
import { ResourceId } from '../../libs/utils/src/request/validate-resource-ids.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum } from '../common';
import { Routes } from './../common/constants/routes.constant';
import { DonateBookService } from './donate-book.service';
import { AddDonateBookDto, AdminDonatedBooksQueryDto } from './dto/donate-book.dto';

@ApiTags('Donate Book')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.DonateBook, version: APIVersions.V1 })
export class DonateBookController {
    constructor(private readonly donateBookService: DonateBookService) {}

    @Post(Routes[ControllersEnum.DonateBook].donateBook)
    donateBook(@UserId() userId: string, @Body() body: AddDonateBookDto) {
        return this.donateBookService.donateBook(userId, body);
    }

    @Get(Routes[ControllersEnum.DonateBook].findDonatedBooks)
    findDonatedBooks(@UserId() userId: string) {
        return this.donateBookService.findDonatedBooks();
    }

    @Get(Routes[ControllersEnum.DonateBook].findDonatedBooksList)
    findDonatedBooksList(@UserId() userId: string, @Query() query: AdminDonatedBooksQueryDto) {
        return this.donateBookService.findDonatedBooksList(userId, query);
    }

    @Get(Routes[ControllersEnum.DonateBook].findUserDonatedBooks)
    findUserDonatedBooks(@UserId() userId: string) {
        return this.donateBookService.findUserDonatedBooks(userId);
    }

    @Post(Routes[ControllersEnum.DonateBook].addDonatedBookToSystem)
    addDonatedBookToSystem(@UserId() userId: string, @ResourceId('id') id: string, @Body() body: AddDonateBookDto) {
        return this.donateBookService.addDonatedBookToSystem(userId, id, body);
    }
}
