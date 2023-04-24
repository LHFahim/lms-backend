import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../../libs/utils/src';
import { APIVersions, ControllersEnum, Routes } from '../../common';
import { ResourceId } from '../../common/decorators/params.decorator';
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard';
import { AdminWalletService } from './admin-wallet.service';
import {
    AdminRechargeWalletDto,
    AdminWalletQueryDto,
    FineWalletDto,
    UpdateAdminWalletDto,
} from './dto/admin-wallet.dto';

@ApiTags('Admin ===> Wallet')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.AdminWallet, version: APIVersions.V1 })
export class AdminWalletController {
    constructor(private readonly adminWalletService: AdminWalletService) {}

    @Get(Routes[ControllersEnum.AdminWallet].queryWallet)
    queryWallet(@UserId() userId: string, @Query() query: AdminWalletQueryDto) {
        return this.adminWalletService.queryWallet(userId, query);
    }

    @Patch(Routes[ControllersEnum.AdminWallet].rechargeWallet)
    rechargeWallet(@UserId() userId: string, @ResourceId() id: string, @Body() body: AdminRechargeWalletDto) {
        return this.adminWalletService.rechargeWallet(userId, id, body);
    }

    @Patch(Routes[ControllersEnum.AdminWallet].fineWallet)
    fineWallet(@UserId() userId: string, @ResourceId('borrowerId') borrowerId: string, @Body() body: FineWalletDto) {
        return this.adminWalletService.fineWallet(userId, borrowerId, body);
    }

    @Patch(Routes[ControllersEnum.AdminWallet].updateWallet)
    updateWallet(@UserId() userId: string, @ResourceId() id: string, @Body() body: UpdateAdminWalletDto) {
        return this.adminWalletService.updateWallet(userId, id, body);
    }
}
