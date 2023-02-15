import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../user/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
    @ApiProperty()
    @Expose()
    accessToken: string;

    @Expose()
    refreshToken: string;

    @Expose()
    @Type(() => UserDto)
    user: UserDto;
}
