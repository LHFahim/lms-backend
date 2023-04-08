import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SerializeService } from '../../libs/utils/src/serializer/serialize.service';
import { CurrencyEnum } from '../common/enums/lms.enum';
import { UserEntity } from '../user/entities/user.entity';
import { ReduceBalanceDto, WalletDto } from './dto/wallet.dto';
import { WalletEntity } from './entities/wallet.entity';

@Injectable()
export class WalletService extends SerializeService<WalletEntity> {
    constructor(
        @InjectModel(WalletEntity) private readonly walletModel: ReturnModelType<typeof WalletEntity>,
        @InjectModel(UserEntity) private readonly userModel: ReturnModelType<typeof UserEntity>,
    ) {
        super(WalletEntity);
    }

    async createWallet(userId: string) {
        const walletExists = await this.walletModel.findOne({ owner: userId });
        if (walletExists) throw new BadRequestException('You already have a wallet');

        const doc = await this.walletModel.create({
            balance: 30,
            currency: CurrencyEnum.POINTS,
            isActive: true,
            isDeleted: false,
            owner: userId,
        });

        await this.userModel.findOneAndUpdate({ _id: userId }, { walletId: doc._id }, { new: true });

        return this.toJSON(doc, WalletDto);
    }

    async findOneWallet(userId: string, _id: string) {
        const doc = await this.walletModel.findOne({ _id }); //owner: userId
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

    async increaseBalanceForJob(userId: string, reward: number) {
        const doc = await this.walletModel.findOneAndUpdate(
            { owner: userId },
            { $inc: { balance: reward } },
            { new: true },
        );

        if (!doc) throw new NotFoundException('Wallet is not found');

        return this.toJSON(doc, WalletDto);
    }
}
