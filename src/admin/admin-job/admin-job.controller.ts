import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../../libs/utils/src';
import { ResourceId } from '../../../libs/utils/src/request/validate-resource-ids.decorator';
import { APIVersions, ControllersEnum, Routes } from '../../common';
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard';
import { AdminJobService } from './admin-job.service';
import { CreateAdminJobDto } from './dto/admin-job.dto';

@ApiTags('Admin ===> Jobs')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.AdminJobs, version: APIVersions.V1 })
export class AdminJobController {
    constructor(private readonly adminJobService: AdminJobService) {}

    @Post(Routes[ControllersEnum.AdminJobs].createJob)
    createJob(@UserId() userId: string, @Body() body: CreateAdminJobDto) {
        return this.adminJobService.createJob(userId, body);
    }
    @Get(Routes[ControllersEnum.AdminJobs].findJobs)
    findJobs(@UserId() userId: string) {
        return this.adminJobService.findJobs(userId);
    }

    @Patch(Routes[ControllersEnum.AdminJobs].approveJobRequest)
    approveJobRequest(@UserId() userId: string, @ResourceId('jobRequestId') jobRequestId: string) {
        return this.adminJobService.approveJobRequest(userId, jobRequestId);
    }

    @Delete(Routes[ControllersEnum.AdminJobs].declineJobRequest)
    declineJobRequest(@UserId() userId: string, @ResourceId('jobRequestId') jobRequestId: string) {
        return this.adminJobService.declineJobRequest(userId, jobRequestId);
    }

    @Patch(Routes[ControllersEnum.AdminJobs].completeJob)
    completeJob(@UserId() userId: string, @ResourceId('jobRequestId') jobRequestId: string) {
        return this.adminJobService.completeJob(userId, jobRequestId);
    }

    @Get(Routes[ControllersEnum.AdminJobs].findJobRequests)
    findJobRequests(@UserId() userId: string) {
        return this.adminJobService.findJobRequests(userId);
    }

    @Get(Routes[ControllersEnum.AdminJobs].findJobRequestsForCompletion)
    findJobRequestsForCompletion(@UserId() userId: string) {
        return this.adminJobService.findJobRequestsForCompletion(userId);
    }

    @Delete(Routes[ControllersEnum.AdminJobs].deleteOneJob)
    deleteOneJob(@UserId() userId: string, @ResourceId() id: string) {
        return this.adminJobService.deleteOneJob(userId, id);
    }
}
