import { Injectable } from '@nestjs/common';
import { Env, Section } from 'atenv';
import { Transform } from 'class-transformer';
import { IsDefined, IsOptional } from 'class-validator';

class AmazonS3 {
    @Env('S3_ACCESS_KEY')
    @IsOptional()
    accessKey: string;

    @Env('S3_SECRET_KEY')
    @IsOptional()
    secretKey: string;

    @Env('S3_BUCKET_ID')
    @IsOptional()
    bucketId: string;

    @Env('S3_DOMAIN_NAME')
    @IsOptional()
    domainName: string;
}

class Email {
    @IsOptional()
    @Env('SMTP_HOST')
    smtpHost: string;

    @IsOptional()
    @Env('SMTP_PORT')
    smtpPort: number;

    @IsOptional()
    @Env('SMTP_USER')
    smtpUser: string;

    @IsOptional()
    @Env('SMTP_PASS')
    smtpPass: string;

    @IsOptional()
    @Env('MAIL_SEND_FROM')
    mailSendFrom: string;
}

class Sendgrid {
    @IsOptional()
    @Env('SENDGRID_API_KEY')
    apiKey: string;

    @IsOptional()
    @Env('MAIL_SEND_FROM')
    mailSendFrom: string;
}

class JWTsettings {
    @IsDefined({ message: 'JWT  secret is required in .env file' })
    @Env('JWT_SECRET')
    secret: string;

    @IsDefined({
        message: 'JWT access token `expires in` is required in .env file',
    })
    @Env('JWT_ACCESS_TOKEN_EXPIRES_IN')
    accessTokenExpiresIn: string;

    @IsDefined({
        message: 'JWT refresh token `expires in` is required in .env file',
    })
    @Env('JWT_REFRESH_TOKEN_EXPIRES_IN')
    refreshTokenExpiresIn: string;
}

class Redis {
    @IsOptional()
    @Env('REDIS_HOST')
    redisHost: string;

    @IsOptional()
    @Env('REDIS_PORT')
    redisPort: number;
}

class Facebook {
    @IsDefined({ message: 'Facebook client id is required in .env file' })
    @Env('FACEBOOK_CLIENT_ID')
    clientId: string;

    @IsDefined({ message: 'Facebook client secret is required in .env file' })
    @Env('FACEBOOK_CLIENT_SECRET')
    clientSecret: string;
}

class Google {
    @IsDefined({ message: 'Facebook client id is required in .env file' })
    @Env('GOOGLE_CLIENT_ID')
    clientId: string;

    @IsDefined({ message: 'Facebook client secret is required in .env file' })
    @Env('GOOGLE_CLIENT_SECRET')
    clientSecret: string;
}

@Injectable()
export class ConfigService {
    @Env('PORT')
    @Transform(({ value }) => parseInt(value) || 3333)
    port = 3333;

    @Env('MONGODB_URL')
    mongoDBURL = 'mongodb://0.0.0.0:27017/auth';

    @Env('STREX_SMS_RECEIVE_SECRET')
    strexSMSReceiveSecret: string;

    @Section(() => JWTsettings)
    jwt: JWTsettings;

    @Section(() => Redis)
    redis: Redis;

    @Section(() => Email)
    email: Email;

    @Section(() => Sendgrid)
    sendgrid: Sendgrid;

    @Section(() => AmazonS3)
    amazonS3: AmazonS3;

    @Section(() => Facebook)
    facebook: Facebook;

    @Section(() => Google)
    google: Google;

    @IsOptional()
    @Env('FRONTEND_URL')
    frontendUrl: string;

    @Env('NODE_ENV')
    nodeEnv: string;

    isProd() {
        return this.nodeEnv === 'production';
    }
}
