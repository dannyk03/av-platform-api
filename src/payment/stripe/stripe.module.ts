import { DynamicModule, Module } from '@nestjs/common';

import { StripeCoreModule } from './stripe.core.module';

import { StripeAsyncOptions, StripeOptions } from './type';

@Module({})
export class StripeModule {
  public static forRoot(options: StripeOptions): DynamicModule {
    return {
      module: StripeModule,
      imports: [StripeCoreModule.forRoot(options)],
      exports: [],
      providers: [],
    };
  }

  public static forRootAsync(options: StripeAsyncOptions): DynamicModule {
    return {
      module: StripeModule,
      imports: [StripeCoreModule.forRootAsync(options)],
      exports: [],
      providers: [],
    };
  }
}
