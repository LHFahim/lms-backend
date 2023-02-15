import { Test, TestingModule } from '@nestjs/testing';
import { AdminAuthController } from './auth.controller';
import { AdminAuthService } from './auth.service';

describe('AuthController', () => {
    let controller: AdminAuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminAuthController],
            providers: [AdminAuthService],
        }).compile();

        controller = module.get<AdminAuthController>(AdminAuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
