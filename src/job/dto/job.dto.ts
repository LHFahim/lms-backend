import { PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common';
import { JobRequestEntity } from '../entities/job-request.entity';

export class CreateJobDto {}
export class UpdateJobDto extends PartialType(CreateJobDto) {}

export class JobQueryDto extends PaginationQueryDto {}

// job request
export class CreateJobRequestDto {
    @Expose()
    @IsString()
    @IsMongoId()
    @IsNotEmpty()
    job: string;
}
export class JobRequestDto extends JobRequestEntity {}
