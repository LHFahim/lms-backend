import { Module } from '@nestjs/common';
import { StorageModule } from 'libs/storage/src';
import { TypegooseModule } from 'nestjs-typegoose';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { TodoModule } from './todo/todo.module';

import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule,
        TypegooseModule.forRootAsync({
            useFactory: (config: ConfigService) => ({ uri: config.mongoDBURL }),
            inject: [ConfigService],
        }),
        StorageModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                accessKeyId: config.amazonS3.accessKey,
                bucket: config.amazonS3.bucketId,
                domainName: config.amazonS3.domainName,
                secretAccessKey: config.amazonS3.secretKey,
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UserModule,
        AdminModule,

        TodoModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
