import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SerializeService } from '../../libs/utils/src/serializer/serialize.service';
import { ReduceBalanceDto, WalletDto } from './dto/wallet.dto';
import { CurrencyEnum, WalletEntity } from './entities/wallet.entity';

@Injectable()
export class WalletService extends SerializeService<WalletEntity> {
    constructor(@InjectModel(WalletEntity) private readonly walletModel: ReturnModelType<typeof WalletEntity>) {
        super(WalletEntity);
    }

    async createWallet(userId: string) {
        const doc = await this.walletModel.create({
            balance: 50,
            currency: CurrencyEnum.BDT,
            isActive: true,
            isDeleted: false,
            owner: userId,
        });

        return this.toJSON(doc, WalletDto);
    }

    async findOneWallet(userId: string, _id: string) {
        const doc = await this.walletModel.findOne({ _id, owner: userId });
        if (!doc) throw new NotFoundException('Wallet is not found');

        return this.toJSON(doc, WalletDto);
    }

    async reduceBalance(userId: string, _id: string, body: ReduceBalanceDto) {
        const doc = await this.walletModel.findOneAndUpdate(
            { _id, owner: userId },
            { $inc: { balance: -body.cost } },
            { new: true },
        );
        if (!doc) throw new NotFoundException('Wallet is not found');

        return this.toJSON(doc, WalletDto);
    }
}
