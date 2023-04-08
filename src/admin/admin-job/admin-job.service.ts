import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SerializeService } from '../../../libs/utils/src/serializer/serialize.service';
import { JobRequestDto } from '../../job/dto/job.dto';
import { JobCompletedEntity } from '../../job/entities/job-completed.entity';
import { JobRequestEntity } from '../../job/entities/job-request.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { WalletService } from '../../wallet/wallet.service';
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
    ) {
        super(JobEntity);
    }

    async createJob(body: CreateAdminJobDto) {
        const doc = await this.jobModel.create({ ...body, isAvailable: true, isDeleted: false, assignedTo: [] });

        return this.toJSON(doc, JobDto);
    }

    async approveJobRequest(jobRequestId: string) {
        const doc = await this.jobRequestModel.findByIdAndUpdate(jobRequestId, { isAssigned: true }, { new: true });

        const job = await this.jobModel.findByIdAndUpdate(
            { _id: doc.job },
            { $addToSet: { assignedTo: doc.requester } },
            { new: true },
        );

        return this.toJSON(doc, JobRequestDto);
    }

    async completeJob(jobRequestId: string) {
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
