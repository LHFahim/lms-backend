import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { JobEntity } from '../admin/admin-job/entities/admin-job.entity';
import { UserEntity } from '../user/entities/user.entity';
import { JobRequestEntity } from './entities/job-request.entity';
import { JobController } from './job.controller';
import { JobService } from './job.service';

@Module({
    imports: [TypegooseModule.forFeature([JobEntity, UserEntity, JobRequestEntity])],
    controllers: [JobController],
    providers: [JobService],
})
export class JobModule {}
