import { Test, TestingModule } from '@nestjs/testing';
import { AdminWalletController } from './admin-wallet.controller';
import { AdminWalletService } from './admin-wallet.service';

describe('AdminWalletController', () => {
  let controller: AdminWalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminWalletController],
      providers: [AdminWalletService],
    }).compile();

    controller = module.get<AdminWalletController>(AdminWalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
