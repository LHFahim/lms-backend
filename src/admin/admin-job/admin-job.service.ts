import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SerializeService } from '../../../libs/utils/src/serializer/serialize.service';
import { JobRequestDto } from '../../job/dto/job.dto';
import { JobCompletedEntity } from '../../job/entities/job-completed.entity';
import { JobRequestEntity } from '../../job/entities/job-request.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { WalletService } from '../../wallet/wallet.service';
import { AdminAuthService } from '../admin-auth/auth.service';
import { CreateAdminJobDto, JobDto } from './dto/admin-job.dto';
import { JobEntity } from './entities/admin-job.entity';

@Injectable()
export class AdminJobService extends SerializeService<JobEntity> {
    constructor(
        @InjectModel(JobEntity) private readonly jobModel: ReturnModelType<typeof JobEntity>,
        @InjectModel(JobRequestEntity) private readonly jobRequestModel: ReturnModelType<typeof JobRequestEntity>,
        @InjectModel(JobCompletedEntity) private readonly completeJobModel: ReturnModelType<typeof JobCompletedEntity>,
        @InjectModel(UserEntity) private readonly userModel: ReturnModelType<typeof UserEntity>,
        private readonly walletService: WalletService,
        private readonly adminAuthService: AdminAuthService,
    ) {
        super(JobEntity);
    }

    async createJob(userId: string, body: CreateAdminJobDto) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const doc = await this.jobModel.create({ ...body, isAvailable: true, isDeleted: false, assignedTo: [] });

        return this.toJSON(doc, JobDto);
    }

    async findJobs(userId: string) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const docs = await this.jobModel.find({ isAvailable: true, isDeleted: false });

        return this.toJSONs(docs, JobDto);
    }

    async approveJobRequest(userId: string, jobRequestId: string) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const doc = await this.jobRequestModel.findByIdAndUpdate(jobRequestId, { isAssigned: true }, { new: true });

        const job = await this.jobModel.findByIdAndUpdate(
            { _id: doc.job },
            { $addToSet: { assignedTo: doc.requester } },
            { new: true },
        );

        return this.toJSON(doc, JobRequestDto);
    }

    async findJobRequests(userId: string) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const docs = await this.jobRequestModel
            .find({ isAssigned: false, isDeleted: false })
            .populate('job')
            .populate('requester');
        if (!docs) throw new NotFoundException('No job request is found');

        return this.toJSONs(docs, JobRequestDto);
    }

    async findJobRequestsForCompletion(userId: string) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const docs = await this.jobRequestModel.find({ isDeleted: false }).populate('job').populate('requester');
        if (!docs) throw new NotFoundException('No job request is found');

        return this.toJSONs(docs, JobRequestDto);
    }

    async declineJobRequest(userId: string, jobRequestId: string) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const doc = await this.jobRequestModel.findByIdAndDelete(jobRequestId);

        return true;
    }

    async deleteOneJob(userId: string, id: string) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const doc = await this.jobModel.findOneAndUpdate(
            { _id: id, isAvailable: true, isDeleted: false },
            { isAvailable: false, isDeleted: true },
            { new: true },
        );
        if (!doc) throw new NotFoundException('Job was not found');
        return this.toJSON(doc, JobDto);
    }

    async completeJob(userId: string, jobRequestId: string) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        const jobRequest = await this.jobRequestModel.findByIdAndUpdate(
            jobRequestId,
            { isDeleted: true },
            { new: true },
        );

        const completeJob = await this.completeJobModel.create({
            job: jobRequest.job,
            assignee: jobRequest.requester,
            jobRequestId: jobRequest.id,
        });

        const job = await this.jobModel.findById({
            _id: jobRequest.job,
        });

        const transferBalance = await this.walletService.increaseBalanceForJob(
            jobRequest.requester.toString(),
            job.reward,
        );

        return this.toJSON(jobRequest, JobRequestDto);
    }
}
