import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export type NestJSAsyncConfigType<T> = Pick<ModuleMetadata, 'imports'> & Omit<FactoryProvider<T>, 'provide'>;
