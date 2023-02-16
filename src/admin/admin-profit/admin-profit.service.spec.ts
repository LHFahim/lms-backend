import { Test, TestingModule } from '@nestjs/testing';
import { AdminProfitService } from './admin-profit.service';

describe('AdminProfitService', () => {
  let service: AdminProfitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminProfitService],
    }).compile();

    service = module.get<AdminProfitService>(AdminProfitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
