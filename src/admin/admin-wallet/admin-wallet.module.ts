import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { WalletEntity } from '../../wallet/entities/wallet.entity';
import { AdminWalletController } from './admin-wallet.controller';
import { AdminWalletService } from './admin-wallet.service';

@Module({
    imports: [TypegooseModule.forFeature([WalletEntity])],
    controllers: [AdminWalletController],
    providers: [AdminWalletService],
})
export class AdminWalletModule {}
