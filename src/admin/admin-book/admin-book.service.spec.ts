import { Test, TestingModule } from '@nestjs/testing';
import { AdminBookService } from './admin-book.service';

describe('AdminBookService', () => {
  let service: AdminBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminBookService],
    }).compile();

    service = module.get<AdminBookService>(AdminBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
