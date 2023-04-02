import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { WalletEntity } from '../../../wallet/entities/wallet.entity';

export class CreateAdminWalletDto {}
export class UpdateAdminWalletDto extends PickType(WalletEntity, ['balance']) {}

export class FineWalletDto {
    @Expose()
    @IsNotEmpty()
    @ApiProperty({ required: true, minimum: 5 })
    fine: number;
}

// response
export class AdminWalletDto extends WalletEntity {}
