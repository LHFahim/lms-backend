import { DocumentCTWithTimeStamps, Model } from '@app/utils';
import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@typegoose/typegoose';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum AuthProvider {
    EMAIL = 'EMAIL',
    GOOGLE = 'GOOGLE',
    APPLE = 'APPLE',
    FACEBOOK = 'FACEBOOK',
    VIPPS = 'VIPPS',
}

export enum PanelType {
    ADMIN = 'ADMIN',
    CLIENT = 'CLIENT',
}

@Model('users', true)
export class UserEntity extends DocumentCTWithTimeStamps {
    @ApiProperty({ required: false })
    @Expose()
    @IsString()
    @IsOptional()
    @Prop({ required: false, trim: true })
    firstName: string;

    @ApiProperty({ required: false })
    @Expose()
    @IsString()
    @IsOptional()
    @Prop({ required: false, trim: true })
    lastName: string;

    @ApiProperty({ required: false })
    @Expose()
    @IsEmail()
    @IsNotEmpty()
    @Prop({ required: true, trim: true })
    email: string;

    @Exclude()
    @ApiProperty({ required: true })
    @Prop({ required: true, trim: true })
    password: string; // must be hashed

    @ApiProperty({ required: false })
    @Expose()
    @IsString()
    @IsOptional()
    @Prop({ required: false, default: '' })
    avatarURL: string;

    @ApiProperty({ required: false, enum: AuthProvider })
    @Expose()
    @Prop({ required: false, enum: AuthProvider })
    @IsOptional()
    authProvider: AuthProvider;

    @Expose()
    @Prop({ required: false, type: Date, default: null })
    lastLogin?: Date;

    @Prop({ required: false, type: Boolean, default: true })
    @Expose()
    isEmailVerified: boolean;

    @ApiProperty({ required: false })
    @Expose()
    @IsString()
    @IsOptional()
    @Prop({ required: false, type: String })
    shortBio: string;

    @ApiProperty({ required: false })
    @Expose()
    @IsString()
    @IsOptional()
    @Prop({ required: false, type: String })
    phoneNumber: string;

    @Expose()
    @IsEnum(PanelType)
    @ApiProperty({ required: false, enum: PanelType })
    @Prop({ required: true, enum: PanelType })
    panelType: PanelType;

    @Prop({ required: false, type: Boolean, default: true })
    @Expose()
    isActive: boolean;

    @Prop({ required: false, type: Boolean, default: false })
    @Expose()
    isDeleted: boolean;
}
