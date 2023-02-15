import { DynamicModule, Global, Module } from '@nestjs/common';
import { StorageModuleConfig, StorageService } from './storage.service';

type AsyncConfigParams = {
  useFactory?: (
    ...args: any[]
  ) => StorageModuleConfig | Promise<StorageModuleConfig>;
  inject?: any[];
  useValue?: StorageModuleConfig;
};

@Global()
@Module({})
export class StorageModule {
  static forRootAsync(data: AsyncConfigParams): DynamicModule {
    return {
      module: StorageModule,
      providers: [
        StorageService,
        {
          provide: 'STORAGE_CONFIG',
          ...(data as any),
        },
      ],
      exports: [StorageService],
    };
  }
}
