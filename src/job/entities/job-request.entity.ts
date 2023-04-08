import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import { DocumentCTWithTimeStamps, Model } from '../../../libs/utils/src';
import { JobEntity } from '../../admin/admin-job/entities/admin-job.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Model('job-requests', true)
export class JobRequestEntity extends DocumentCTWithTimeStamps {
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
    requester: Ref<UserEntity>;

    @Expose()
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ required: true, default: false })
    @Prop({ required: true, default: false })
    isAssigned: boolean;

    @Expose()
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, default: false, trim: true })
    isDeleted: boolean;
}
