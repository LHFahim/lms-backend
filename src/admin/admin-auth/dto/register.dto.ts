import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { AuthProvider, UserEntity } from 'src/user/entities/user.entity';

export class RegisterDto extends PickType(UserEntity, [
    'firstName',
    'lastName',
    'email',

    'shortBio',
    'phoneNumber',
    'avatarURL',
]) {
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    // it's just to pass in func
    @ApiProperty({ required: false, readOnly: true })
    authProvider: AuthProvider;
}
