import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GlobalExceptionFilter, GlobalResponseTransformer } from 'libs/utils/src';
import 'source-map-support/register';
import { AppModule } from './app.module';

import { ConfigService } from './config/config.service';
import { setupSwagger } from './setupSwagger';

require('./common/prototypes/index');

async function bootstrap() {
    const logger = new Logger('Startup');

    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const appConfig = app.get<ConfigService>(ConfigService);

    app.disable('x-powered-by');

    const validationPipe = new ValidationPipe({
        whitelist: true,
        stopAtFirstError: true,
        transform: true,
        transformOptions: {
            enableCircularCheck: true,
            exposeDefaultValues: true,
        },
    });

    app.useGlobalPipes(validationPipe);
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new GlobalResponseTransformer());

    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI });
    app.enableCors();

    setupSwagger(app);

    await app.listen(appConfig.port);
    logger.log(`App Started on http://localhost:${appConfig.port}/api`);
}

bootstrap().then();
