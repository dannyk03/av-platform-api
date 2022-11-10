import { DynamicModule, Module } from '@nestjs/common';

import { TwilioCoreModule } from './twilio.core.module';

import { TwilioAsyncOptions, TwilioOptions } from './type';

@Module({})
export class TwilioModule {
  public static forRoot(options: TwilioOptions): DynamicModule {
    return {
      module: TwilioModule,
      imports: [TwilioCoreModule.forRoot(options)],
      exports: [],
      providers: [],
    };
  }

  public static forRootAsync(options: TwilioAsyncOptions): DynamicModule {
    return {
      module: TwilioModule,
      imports: [TwilioCoreModule.forRootAsync(options)],
      exports: [],
      providers: [],
    };
  }
}
