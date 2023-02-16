import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserEntity } from '../user/entities/user.entity';
import { WalletEntity } from './entities/wallet.entity';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
    imports: [TypegooseModule.forFeature([WalletEntity, UserEntity])],
    controllers: [WalletController],
    providers: [WalletService],
})
export class WalletModule {}
