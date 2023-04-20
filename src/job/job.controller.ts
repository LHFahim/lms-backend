import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Serialize, UserId } from '../../libs/utils/src';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum, Routes } from '../common';
import { ResourceId } from '../common/decorators/params.decorator';
import { CreateJobRequestDto, JobQueryDto } from './dto/job.dto';
import { JobService } from './job.service';

@ApiTags('Jobs')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.Jobs, version: APIVersions.V1 })
export class JobController {
    constructor(private readonly jobService: JobService) {}

    @Get(Routes[ControllersEnum.Jobs].findJobs)
    findJobs(@Query() query: JobQueryDto) {
        return this.jobService.findJobs(query);
    }

    @Post(Routes[ControllersEnum.Jobs].applyForJob)
    applyForJob(@UserId() userId: string, @Body() body: CreateJobRequestDto) {
        return this.jobService.applyForJob(userId, body);
    }

    @Patch(Routes[ControllersEnum.Jobs].withdrawFromJob)
    withdrawFromJob(@UserId() userId: string, @ResourceId() id: string) {
        return this.jobService.withdrawFromJob(userId, id);
    }
}
