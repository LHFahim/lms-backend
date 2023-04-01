import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Query,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Routes } from 'src/common';
import { Serialize, UserId } from '../../../libs/utils/src';
import { ResourceId } from '../../../libs/utils/src/request/validate-resource-ids.decorator';
import { APIVersions, ControllersEnum } from '../../common';
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard';
import { AdminBookService } from './admin-book.service';

import { AdminBooksQueryDto, CreateAdminBookDto, RestockAdminBookDto, UpdateAdminBookDto } from './dto/admin-book.dto';

@ApiTags('Admin ===> Books')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.AdminBooks, version: APIVersions.V1 })
export class AdminBookController {
    constructor(private readonly adminBookService: AdminBookService) {}

    @Post(Routes[ControllersEnum.AdminBooks].addBook)
    addBook(@UserId() userId: string, @Body() body: CreateAdminBookDto) {
        console.log('hit addBook()');
        return this.adminBookService.addBook(userId, body);
    }

    @Get(Routes[ControllersEnum.AdminBooks].findBooks)
    findBooks(@UserId() userId: string, @Query() query: AdminBooksQueryDto) {
        return this.adminBookService.findBooks(userId, query);
    }

    @Get(Routes[ControllersEnum.AdminBooks].findOneBook)
    findOneBook(@UserId() userId: string, @ResourceId() id: string) {
        return this.adminBookService.findOne(userId, id);
    }

    @Patch(Routes[ControllersEnum.AdminBooks].updateOneBook)
    updateOneBook(@UserId() userId: string, @ResourceId() id: string, @Body() body: UpdateAdminBookDto) {
        return this.adminBookService.updateOneBook(userId, id, body);
    }

    @Patch(Routes[ControllersEnum.AdminBooks].restockOneBook)
    restockOneBook(@UserId() userId: string, @ResourceId() id: string, @Body() body: RestockAdminBookDto) {
        return this.adminBookService.restockOneBook(userId, id, body);
    }

    @Delete(Routes[ControllersEnum.AdminBooks].deleteOneBook)
    deleteOneBook(@UserId() userId: string, @ResourceId() id: string) {
        return this.adminBookService.deleteOneBook(userId, id);
    }

    @UseInterceptors(
        FilesInterceptor('assets', 10, {
            limits: { fileSize: 10 * 1024 * 1024 },
            fileFilter(req, file, cb) {
                if (!file.originalname.match(/\.(png|json|jpeg|jpg|webp|zip|doc)$/)) {
                    cb(new Error('Please upload a PNG image.'), false);
                }
                cb(undefined, true);
            },
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['assets'],
            properties: {
                assets: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    @Post(Routes[ControllersEnum.AdminBooks].uploadBooks)
    uploadBooks(@UserId() userId: string, @UploadedFiles() files: Array<Express.Multer.File>) {
        return this.adminBookService.uploadBooks(userId, files);
    }
}
