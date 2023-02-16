import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Model } from '../../../../libs/utils/src';
import { CurrencyEnum } from '../../../common/enums/lms.enum';

@Model('profit', true)
export class ProfitEntity {
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true, default: 0, minimum: 0 })
    @Prop({ required: true, default: 0, min: 0 })
    amount: number;

    @Expose()
    @IsEnum(CurrencyEnum)
    @IsNotEmpty()
    @ApiProperty({ required: true, default: CurrencyEnum.BDT })
    @Prop({ required: true, default: CurrencyEnum.BDT })
    currency: CurrencyEnum;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true, default: 0, minimum: 0 })
    @Prop({ required: true, default: 0, min: 0 })
    gaveAway: number;
}
