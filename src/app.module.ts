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

import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleModule } from '@nestjs/schedule';
import { BooksModule } from './books/books.module';
import { BorrowBookModule } from './borrow-book/borrow-book.module';
import { DiscussionModule } from './discussion/discussion.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { WaitingListModule } from './waiting-list/waiting-list.module';

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

        ScheduleModule.forRoot(),

        MailerModule.forRoot({
            transport: {
                host: 'smtp.sendgrid.net',
                auth: {
                    user: 'apikey',
                    pass: process.env.SEND_GRID_PASSWORD,
                },
            },
        }),

        AuthModule,
        UserModule,
        AdminModule,

        TodoModule,

        BooksModule,

        WalletModule,

        BorrowBookModule,

        DiscussionModule,

        WaitingListModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
