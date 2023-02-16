import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import { Model } from '../../../libs/utils/src';
import { CurrencyEnum } from '../../common/enums/lms.enum';
import { UserEntity } from '../../user/entities/user.entity';

@Model('wallet', true)
export class WalletEntity {
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true, default: 0, minimum: 0 })
    @Prop({ required: true, default: 0, min: 0 })
    balance: number;

    @Expose()
    @IsEnum(CurrencyEnum)
    @IsNotEmpty()
    @ApiProperty({ required: true, default: CurrencyEnum.BDT })
    @Prop({ required: true, default: CurrencyEnum.BDT })
    currency: CurrencyEnum;

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
