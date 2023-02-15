import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { WalletEntity } from '../entities/wallet.entity';

export class CreateWalletDto {}

export class UpdateWalletDto extends PartialType(CreateWalletDto) {}
export class ReduceBalanceDto {
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true, minimum: 0 })
    cost: number;
}

// response
export class WalletDto extends PickType(WalletEntity, ['balance', 'currency']) {}
