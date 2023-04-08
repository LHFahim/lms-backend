import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { JobCompletedEntity } from '../../job/entities/job-completed.entity';
import { JobRequestEntity } from '../../job/entities/job-request.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { WalletEntity } from '../../wallet/entities/wallet.entity';
import { WalletService } from '../../wallet/wallet.service';
import { AdminJobController } from './admin-job.controller';
import { AdminJobService } from './admin-job.service';
import { JobEntity } from './entities/admin-job.entity';

@Module({
    imports: [TypegooseModule.forFeature([JobEntity, UserEntity, WalletEntity, JobRequestEntity, JobCompletedEntity])],
    controllers: [AdminJobController],
    providers: [AdminJobService, WalletService],
})
export class AdminJobModule {}
