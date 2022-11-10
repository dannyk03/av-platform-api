import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import {
  TwilioAsyncOptions,
  TwilioOptions,
  TwilioOptionsFactory,
} from './type';

import { TWILIO_MODULE_OPTIONS, TWILIO_TOKEN } from './constant';

import { createTwilioProvider } from './provider';
import { getTwilioClient } from './utils';

@Global()
@Module({})
export class TwilioCoreModule {
  public static forRoot(options: TwilioOptions): DynamicModule {
    const provider = createTwilioProvider(options);

    return {
      exports: [provider],
      module: TwilioCoreModule,
      providers: [provider],
    };
  }

  static forRootAsync(options: TwilioAsyncOptions): DynamicModule {
    const twilioProvider: Provider = {
      inject: [TWILIO_MODULE_OPTIONS],
      provide: TWILIO_TOKEN,
      useFactory: (twilioOptions: TwilioOptions) =>
        getTwilioClient(twilioOptions),
    };

    return {
      exports: [twilioProvider],
      imports: options.imports,
      module: TwilioCoreModule,
      providers: [...this.createAsyncProviders(options), twilioProvider],
    };
  }

  private static createAsyncProviders(options: TwilioAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: TwilioAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        inject: options.inject || [],
        provide: TWILIO_MODULE_OPTIONS,
        useFactory: options.useFactory,
      };
    }

    return {
      inject: [options.useExisting || options.useClass],
      provide: TWILIO_MODULE_OPTIONS,
      useFactory: (optionsFactory: TwilioOptionsFactory) =>
        optionsFactory.createTwilioOptions(),
    };
  }
}
