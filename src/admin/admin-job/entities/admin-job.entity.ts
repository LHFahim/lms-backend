import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { DocumentCTWithTimeStamps, Model } from '../../../../libs/utils/src';
import { UserEntity } from '../../../user/entities/user.entity';

@Model('jobs', true)
export class JobEntity extends DocumentCTWithTimeStamps {
    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    title: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    description: string;

    @Expose()
    @IsNotEmpty()
    @ApiProperty({ required: false, minimum: 10 })
    @Prop({ required: false, trim: true, min: 10 })
    reward: number;

    @Expose()
    @IsArray()
    @ApiProperty({ required: true })
    @Prop({ required: true, default: [] })
    @IsMongoId({ each: true })
    assignedTo: Ref<UserEntity>[];

    @Expose()
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    isAvailable: boolean;

    @Expose()
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    isDeleted: boolean;
}
