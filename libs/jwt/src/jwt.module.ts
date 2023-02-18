import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { JWTService, JWTSettings } from './jwt.service';

type JWTModuleConfig = {
    useValue?: JWTSettings;
    useExisting?: JWTSettings;
    useFactory?: (...args: any[]) => JWTSettings;
    inject?: any[];
    useClass?: Type<JWTSettings>;
};

@Global()
@Module({})
export class JWTModule {
    static forFeatureAsync(data: JWTModuleConfig): DynamicModule {
        return {
            module: JWTModule,
            providers: [
                JWTSettings,
                JWTService,
                {
                    provide: JWTSettings,
                    ...(data as any),
                },
            ],
            exports: [JWTService],
        };
    }
}
