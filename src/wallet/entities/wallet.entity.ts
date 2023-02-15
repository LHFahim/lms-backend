import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import { Model } from '../../../libs/utils/src';
import { UserEntity } from '../../user/entities/user.entity';

export enum BalanceEnum {
    POINTS = 'POINTS',
    BDT = 'BDT',
}

@Model('wallet', true)
export class Wallet {
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true, default: 0, minimum: 0 })
    @Prop({ required: true, default: 0, min: 0 })
    balance: number;

    @Expose()
    @IsEnum(BalanceEnum)
    @IsNotEmpty()
    @Prop({ required: true, default: BalanceEnum.BDT })
    type: BalanceEnum;

    @Expose()
    @IsMongoId()
    @IsNotEmpty()
    @Type(() => UserEntity)
    @Prop({ required: true, ref: () => UserEntity })
    owner: Ref<UserEntity>;

    @IsBoolean()
    @IsNotEmpty()
    @Prop({ required: true, default: true })
    isActive: boolean;

    @IsBoolean()
    @IsNotEmpty()
    @Prop({ required: true, default: false })
    isDeleted: boolean;
}
