import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SerializeService } from '../../libs/utils/src/serializer/serialize.service';
import { JobDto, JobsPaginatedDto } from '../admin/admin-job/dto/admin-job.dto';
import { JobEntity } from '../admin/admin-job/entities/admin-job.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CreateJobRequestDto, JobQueryDto, JobRequestDto } from './dto/job.dto';
import { JobRequestEntity } from './entities/job-request.entity';

@Injectable()
export class JobService extends SerializeService<JobEntity> {
    constructor(
        @InjectModel(JobEntity) private readonly jobModel: ReturnModelType<typeof JobEntity>,
        @InjectModel(JobRequestEntity) private readonly jobRequestModel: ReturnModelType<typeof JobRequestEntity>,
        @InjectModel(UserEntity) private readonly userModel: ReturnModelType<typeof UserEntity>,
    ) {
        super(JobEntity);
    }

    async findJobs(query: JobQueryDto): Promise<JobsPaginatedDto> {
        const docs = await this.jobModel
            .find({ isAvailable: true, isDeleted: false })
            .sort({ [query.sortBy]: query.sort })
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize);
        if (!docs) throw new NotFoundException('No job is found');

        const docsCount = await this.jobModel.count({ isAvailable: true, isDeleted: false });

        return {
            data: this.toJSONs(docs, JobDto),
            pagination: {
                total: docsCount,
                current: query.page,
                previous: query.page === 1 ? 1 : query.page - 1,
                next: docs.length > query.page * query.pageSize ? query.page + 1 : query.page,
            },
        };
    }

    async applyForJob(userId: string, body: CreateJobRequestDto) {
        const requestExists = await this.jobRequestModel.findOne({
            job: body.job,
            requester: userId,
            isDeleted: false,
        });
        if (requestExists) throw new ConflictException('Already applied for this job');

        const alreadyAssigned = await this.jobModel.findOne({
            job: body.job,
            assignedTo: { $in: userId },
        });
        if (alreadyAssigned) throw new ConflictException('Already working in this job');

        const doc = await this.jobRequestModel.create({
            ...body,
            isAssigned: false,
            requester: userId,
            isDeleted: false,
        });

        return this.toJSON(doc, JobRequestDto);
    }
}
