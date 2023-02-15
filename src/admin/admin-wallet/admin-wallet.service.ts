import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SerializableService } from '../../interfaces/serializable.class';
import { WalletEntity } from '../../wallet/entities/wallet.entity';
import { AdminWalletDto, FineWalletDto, UpdateAdminWalletDto } from './dto/admin-wallet.dto';

@Injectable()
export class AdminWalletService extends SerializableService<WalletEntity> {
    constructor(@InjectModel(WalletEntity) private readonly walletModel: ReturnModelType<typeof WalletEntity>) {
        super(WalletEntity);
    }

    async updateWallet(userId: string, _id: string, body: UpdateAdminWalletDto) {
        const doc = await this.walletModel.findOneAndUpdate({ _id }, { balance: body.balance }, { new: true });

        if (!doc) throw new NotFoundException('Wallet is not found');

        return this.toJSON(doc, AdminWalletDto);
    }

    fineWallet(userId: string, id: string, body: FineWalletDto) {
        throw new Error('Method not implemented.');
    }
}
