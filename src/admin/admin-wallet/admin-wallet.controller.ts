import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize, UserId } from '../../../libs/utils/src';
import { APIVersions, ControllersEnum, Routes } from '../../common';
import { ResourceId } from '../../common/decorators/params.decorator';
import { JwtAuthGuard } from '../admin-auth/guards/jwt-auth.guard';
import { AdminWalletService } from './admin-wallet.service';
import { FineWalletDto, UpdateAdminWalletDto } from './dto/admin-wallet.dto';

@ApiTags('Admin ===> Wallet')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.AdminWallet, version: APIVersions.V1 })
export class AdminWalletController {
    constructor(private readonly adminWalletService: AdminWalletService) {}

    @Patch(Routes[ControllersEnum.AdminWallet].fineWallet)
    fineWallet(@UserId() userId: string, @ResourceId('borrowerId') borrowerId: string, @Body() body: FineWalletDto) {
        console.log('hellooooooo', borrowerId);
        return this.adminWalletService.fineWallet(userId, borrowerId, body);
    }

    @Patch(Routes[ControllersEnum.AdminWallet].updateWallet)
    updateWallet(@UserId() userId: string, @ResourceId() id: string, @Body() body: UpdateAdminWalletDto) {
        return this.adminWalletService.updateWallet(userId, id, body);
    }
}
