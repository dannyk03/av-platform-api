import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import {
  StripeAsyncOptions,
  StripeOptions,
  StripeOptionsFactory,
} from './type';

import { STRIPE_MODULE_OPTIONS, STRIPE_TOKEN } from './constant';

import { createStripeProvider } from './provider';
import { getStripeClient } from './utils';

@Global()
@Module({})
export class StripeCoreModule {
  public static forRoot(options: StripeOptions): DynamicModule {
    const provider = createStripeProvider(options);

    return {
      exports: [provider],
      module: StripeCoreModule,
      providers: [provider],
    };
  }

  static forRootAsync(options: StripeAsyncOptions): DynamicModule {
    const stripeProvider: Provider = {
      inject: [STRIPE_MODULE_OPTIONS],
      provide: STRIPE_TOKEN,
      useFactory: (stripeOptions: StripeOptions) =>
        getStripeClient(stripeOptions),
    };

    return {
      exports: [stripeProvider],
      imports: options.imports,
      module: StripeCoreModule,
      providers: [...this.createAsyncProviders(options), stripeProvider],
    };
  }

  private static createAsyncProviders(options: StripeAsyncOptions): Provider[] {
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
    options: StripeAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        inject: options.inject || [],
        provide: STRIPE_MODULE_OPTIONS,
        useFactory: options.useFactory,
      };
    }

    return {
      inject: [options.useExisting || options.useClass],
      provide: STRIPE_MODULE_OPTIONS,
      useFactory: (optionsFactory: StripeOptionsFactory) =>
        optionsFactory.createStripeOptions(),
    };
  }
}
