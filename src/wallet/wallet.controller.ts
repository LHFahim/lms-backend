import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../libs/utils/src';
import { ResourceId } from '../../libs/utils/src/request/validate-resource-ids.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { APIVersions, ControllersEnum, Routes } from '../common';
import { ReduceBalanceDto } from './dto/wallet.dto';
import { WalletService } from './wallet.service';

@ApiTags('Wallet')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.Wallet, version: APIVersions.V1 })
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Post(Routes[ControllersEnum.Wallet].createWallet)
    createWallet(@UserId() userId: string) {
        return this.walletService.createWallet(userId);
    }

    @Get(Routes[ControllersEnum.Wallet].findOneWallet)
    findOneWallet(@UserId() userId: string, @ResourceId() id: string) {
        return this.walletService.findOneWallet(userId, id);
    }

    @Patch(Routes[ControllersEnum.Wallet].reduceBalance)
    reduceBalance(@UserId() userId: string, @ResourceId() id: string, @Body() body: ReduceBalanceDto) {
        return this.walletService.reduceBalance(userId, id, body);
    }
}
