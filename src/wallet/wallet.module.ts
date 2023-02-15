import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { WalletEntity } from './entities/wallet.entity';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
    imports: [TypegooseModule.forFeature([WalletEntity])],
    controllers: [WalletController],
    providers: [WalletService],
})
export class WalletModule {}
