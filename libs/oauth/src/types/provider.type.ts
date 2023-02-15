import { ApiProperty } from '@nestjs/swagger';
import { OAuthProviders } from './config.type';

export class OAuthProfileResponse {
    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    avatarURL: string;

    @ApiProperty()
    isEmailVerified: boolean;

    @ApiProperty()
    provider: OAuthProviders;
}

export abstract class OAuthServiceProvider {
    abstract validateCode(code: string): Promise<string>;

    abstract getUserInfo(accessToken: string): Promise<OAuthProfileResponse>;

    abstract getRedirectURL(): string;
}
