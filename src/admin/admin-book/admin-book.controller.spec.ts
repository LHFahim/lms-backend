import { Test, TestingModule } from '@nestjs/testing';
import { AdminBookController } from './admin-book.controller';
import { AdminBookService } from './admin-book.service';

describe('AdminBookController', () => {
  let controller: AdminBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminBookController],
      providers: [AdminBookService],
    }).compile();

    controller = module.get<AdminBookController>(AdminBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
