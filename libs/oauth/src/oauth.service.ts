import { Base64Decode } from '@app/utils/string/base64';
import { Injectable } from '@nestjs/common';
import { InjectOAuthConfig } from './constants';
import { FacebookOAuthProvider } from './providers/facebook.provider';
import { GoogleOAuthProvider } from './providers/google.provider';
import { VippsOAuthProvider } from './providers/vipps.provider';
import { OAuthModuleConfig, OAuthProviders, OAuthServiceConfigWithRedirect } from './types/config.type';
import { OAuthProfileResponse, OAuthServiceProvider } from './types/provider.type';

type ProviderClass = new (config: OAuthServiceConfigWithRedirect) => OAuthServiceProvider;

@Injectable()
export class OAuthService {
    constructor(@InjectOAuthConfig() private config: OAuthModuleConfig) {}

    private providerMap: Record<OAuthProviders, ProviderClass> = {
        [OAuthProviders.FACEBOOK]: FacebookOAuthProvider,
        [OAuthProviders.GOOGLE]: GoogleOAuthProvider,
        [OAuthProviders.VIPPS]: VippsOAuthProvider,
    };

    getRedirectURL(provider: OAuthProviders): string {
        return this.getProvider(provider).getRedirectURL();
    }

    async handleRedirect(code: string, state: string): Promise<OAuthProfileResponse> {
        const stateObj = JSON.parse(Base64Decode(state)) as {
            provider: OAuthProviders;
        };
        const { provider } = stateObj;
        const accessToken = await this.validateCode(provider, code);
        if (!accessToken) {
            throw new Error('Token not Supported');
        }
        return this.getUserInfo(provider, accessToken);
    }

    private async validateCode(provider: OAuthProviders, code: string): Promise<string> {
        return await this.getProvider(provider).validateCode(code);
    }

    private getUserInfo(provider: OAuthProviders, accessToken: string): Promise<OAuthProfileResponse> {
        return this.getProvider(provider).getUserInfo(accessToken);
    }

    private getProvider(provider: OAuthProviders): OAuthServiceProvider {
        const providerClass = this.providerMap[provider];
        const providerConfig = this.config[provider];
        if (!providerConfig) {
            throw new Error('Provider not Supported');
        }

        return new providerClass({
            ...providerConfig,
            redirectURL: this.config.redirectURL,
        });
    }
}
