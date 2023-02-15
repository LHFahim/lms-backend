import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Routes } from 'src/common';
import { Serialize, UserId } from '../../../libs/utils/src';
import { ResourceId } from '../../../libs/utils/src/request/validate-resource-ids.decorator';
import { APIVersions, ControllersEnum } from '../../common';
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard';
import { AdminBookService } from './admin-book.service';

import { CreateAdminBookDto, UpdateAdminBookDto } from './dto/admin-book.dto';

@ApiTags('Admin ===> Books')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.AdminBooks, version: APIVersions.V1 })
export class AdminBookController {
    constructor(private readonly adminBookService: AdminBookService) {}

    @Post(Routes[ControllersEnum.AdminBooks].addBook)
    addBook(@UserId() userId: string, @Body() body: CreateAdminBookDto) {
        return this.adminBookService.addBook(userId, body);
    }

    @Get(Routes[ControllersEnum.AdminBooks].findBooks)
    findBooks(@UserId() userId: string) {
        return this.adminBookService.findBooks(userId);
    }

    @Get(Routes[ControllersEnum.AdminBooks].findOneBook)
    findOneBook(@UserId() userId: string, @ResourceId() id: string) {
        return this.adminBookService.findOne(userId, id);
    }

    @Patch(Routes[ControllersEnum.AdminBooks].updateOneBook)
    updateOneBook(@UserId() userId: string, @ResourceId() id: string, @Body() body: UpdateAdminBookDto) {
        return this.adminBookService.updateOneBook(userId, id, body);
    }

    @Delete(Routes[ControllersEnum.AdminBooks].deleteOneBook)
    deleteOneBook(@UserId() userId: string, @ResourceId() id: string) {
        return this.adminBookService.deleteOneBook(userId, id);
    }
}
