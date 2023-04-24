import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { SerializableService } from '../../interfaces/serializable.class';
import { WalletEntity } from '../../wallet/entities/wallet.entity';
import { AdminAuthService } from '../admin-auth/auth.service';
import {
    AdminRechargeWalletDto,
    AdminWalletDto,
    AdminWalletQueryDto,
    FineWalletDto,
    UpdateAdminWalletDto,
} from './dto/admin-wallet.dto';

@Injectable()
export class AdminWalletService extends SerializableService<WalletEntity> {
    constructor(
        @InjectModel(WalletEntity) private readonly walletModel: ReturnModelType<typeof WalletEntity>,
        private adminAuthService: AdminAuthService,
    ) {
        super(WalletEntity);
    }

    async queryWallet(query: AdminWalletQueryDto) {
        const doc = await this.walletModel.aggregate([
            { $match: { isActive: true, isDeleted: false } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'retrievedOwner',
                    pipeline: [
                        {
                            $addFields: {
                                wallet: { $toString: '$walletId' },
                            },
                        },
                    ],
                },
            },

            {
                $project: {
                    owner: { $arrayElemAt: ['$retrievedOwner', 0] },
                    _id: 0,
                },
            },
            {
                $match: { 'owner.email': { $regex: query.email, $options: 'i' } },
            },
            {
                $lookup: {
                    from: 'wallet',
                    localField: 'owner.walletId',
                    foreignField: '_id',
                    as: 'walletDoc',
                },
            },
            { $unwind: '$walletDoc' },
        ]);

        console.log('🚀 ~ file: admin-wallet.service.ts:21 ~ AdminWalletService ~ queryWallet ~ docs: %o', doc);

        return doc;
    }

    async rechargeWallet(_id: string, body: AdminRechargeWalletDto) {
        const doc = await this.walletModel.findOneAndUpdate(
            { _id, isActive: true, isDeleted: false },
            { $inc: { balance: body.balance } },
            { new: true },
        );

        return this.toJSON(doc, AdminWalletDto);
    }

    async updateWallet(userId: string, _id: string, body: UpdateAdminWalletDto) {
        const doc = await this.walletModel.findOneAndUpdate({ _id }, { balance: body.balance }, { new: true });

        if (!doc) throw new NotFoundException('Wallet is not found');

        return this.toJSON(doc, AdminWalletDto);
    }

    async fineWallet(userId: string, borrowerId: string, body: FineWalletDto) {
        if (!(await this.adminAuthService.isAdmin(userId))) throw new BadRequestException('This is for admin');

        console.log(userId, borrowerId, body);
        const doc = await this.walletModel.findOneAndUpdate(
            { owner: borrowerId },
            { $inc: { balance: -body.fine } },
            { new: true },
        );

        return this.toJSON(doc, AdminWalletDto);
    }
}
