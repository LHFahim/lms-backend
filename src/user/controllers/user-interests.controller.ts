import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../../libs/utils/src';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum, Routes } from '../../common';
import { UserInterestsService } from '../services/user-interests.service';

@ApiTags('User Interests')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.UserInterests, version: APIVersions.V1 })
export class UserInterestsController {
    constructor(private readonly interestService: UserInterestsService) {}

    @Get(Routes[ControllersEnum.UserInterests].findUserInterests)
    async findUserInterests(@UserId() userId: string) {
        return await this.interestService.findUserInterests(userId);
    }
}
