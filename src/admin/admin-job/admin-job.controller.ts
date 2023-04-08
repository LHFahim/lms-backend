import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize } from '../../../libs/utils/src';
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
    createJob(@Body() body: CreateAdminJobDto) {
        return this.adminJobService.createJob(body);
    }

    @Patch(Routes[ControllersEnum.AdminJobs].approveJobRequest)
    approveJobRequest(@ResourceId('jobRequestId') jobRequestId: string) {
        return this.adminJobService.approveJobRequest(jobRequestId);
    }

    @Patch(Routes[ControllersEnum.AdminJobs].completeJob)
    completeJob(@ResourceId('jobRequestId') jobRequestId: string) {
        return this.adminJobService.completeJob(jobRequestId);
    }
}
