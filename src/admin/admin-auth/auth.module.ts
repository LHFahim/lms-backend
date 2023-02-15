import { Global, Module } from '@nestjs/common';
import { JWTModule } from 'libs/jwt/src';
import { OAuthService } from 'libs/oauth/src';
import { OAuthConfigInjectionToken } from 'libs/oauth/src/constants';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigService } from 'src/config/config.service';
import { AdminAuthController } from './auth.controller';
import { AdminAuthService } from './auth.service';
import { OTPEntity } from './entities/otp';

@Global()
@Module({
    controllers: [AdminAuthController],
    providers: [
        AdminAuthService,
        {
            provide: OAuthConfigInjectionToken,
            inject: [ConfigService],
            useFactory: (_config: ConfigService) => ({
                facebook: {
                    clientID: _config.facebook.clientId,
                    clientSecret: _config.facebook.clientSecret,
                },
                google: {
                    clientID: _config.google.clientId,
                    clientSecret: _config.google.clientSecret,
                },
                redirectURL: 'http://localhost:3333/api/v1/auth/register/redirect',
            }),
        },
        OAuthService,
    ],
    imports: [
        TypegooseModule.forFeature([OTPEntity]),
        JWTModule.forFeatureAsync({
            useFactory: (config: ConfigService) => ({
                secret: config.jwt.secret,
                expiresIn: config.jwt.accessTokenExpiresIn,
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [AdminAuthService],
})
export class AdminAuthModule {}
