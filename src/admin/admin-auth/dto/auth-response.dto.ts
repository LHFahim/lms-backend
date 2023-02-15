import { Expose, Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../../user/dto/user.dto';

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
