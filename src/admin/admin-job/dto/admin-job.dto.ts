import { PartialType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { JobEntity } from '../entities/admin-job.entity';

export class CreateAdminJobDto extends PickType(JobEntity, ['title', 'description', 'reward']) {}

export class UpdateAdminJobDto extends PartialType(CreateAdminJobDto) {}

export class JobDto extends JobEntity {}

export class JobsPaginatedDto {
    @Expose()
    data: JobDto[];

    @Expose()
    pagination: PaginationDto;
}
