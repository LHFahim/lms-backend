import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Roles } from 'aws-sdk/clients/budgets';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserLiteDto } from '../../../user/dto/user.dto';
import { UserEntity } from '../../../user/entities/user.entity';

export class RegisterDto extends PickType(UserEntity, ['firstName', 'lastName', 'email']) {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}

export class LoginDto extends PickType(UserEntity, ['email']) {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @Expose()
    password: string;
}

export class AuthUserDto {
    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    roleName: Roles;
}

export class FirebaseAuthTokenDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    @Expose()
    token: string;
}

export class AuthResponseDto {
    @Expose()
    accessToken: string;

    @Expose()
    refreshToken: string;

    @Expose()
    user: UserLiteDto;
}

export class AuthProfileDto extends OmitType(UserEntity, ['password']) {}

export class VerifyEmailDto extends PickType(UserEntity, ['email']) {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    code: string;
}
