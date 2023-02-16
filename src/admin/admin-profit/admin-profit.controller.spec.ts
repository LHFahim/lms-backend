import { Test, TestingModule } from '@nestjs/testing';
import { AdminProfitController } from './admin-profit.controller';
import { AdminProfitService } from './admin-profit.service';

describe('AdminProfitController', () => {
  let controller: AdminProfitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminProfitController],
      providers: [AdminProfitService],
    }).compile();

    controller = module.get<AdminProfitController>(AdminProfitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
