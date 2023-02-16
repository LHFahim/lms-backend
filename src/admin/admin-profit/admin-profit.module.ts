import { Module } from '@nestjs/common';
import { AdminProfitService } from './admin-profit.service';
import { AdminProfitController } from './admin-profit.controller';

@Module({
  controllers: [AdminProfitController],
  providers: [AdminProfitService]
})
export class AdminProfitModule {}
