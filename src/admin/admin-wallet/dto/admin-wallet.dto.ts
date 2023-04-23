import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { WalletEntity } from '../../../wallet/entities/wallet.entity';

export class CreateAdminWalletDto {}
export class UpdateAdminWalletDto extends PickType(WalletEntity, ['balance']) {}

export class FineWalletDto {
    @Expose()
    @IsNotEmpty()
    @ApiProperty({ required: true, minimum: 5 })
    fine: number;
}
export class AdminRechargeWalletDto {
    @Expose()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    balance: number;
}

// response
export class AdminWalletDto extends WalletEntity {}

export class AdminWalletQueryDto {
    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    email: string;
}
