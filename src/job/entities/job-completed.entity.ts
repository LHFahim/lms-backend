import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { DocumentCTWithTimeStamps, Model } from '../../../libs/utils/src';
import { JobEntity } from '../../admin/admin-job/entities/admin-job.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { JobRequestEntity } from './job-request.entity';

@Model('job-completed', true)
export class JobCompletedEntity extends DocumentCTWithTimeStamps {
    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => JobEntity)
    @Prop({ required: true, ref: () => JobEntity })
    job: Ref<JobEntity>;

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => UserEntity)
    @Prop({ required: true, ref: () => UserEntity })
    assignee: Ref<UserEntity>;

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => JobRequestEntity)
    @Prop({ required: true, ref: () => JobRequestEntity })
    jobRequestId: Ref<JobRequestEntity>;
}
