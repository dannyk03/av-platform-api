import { DynamicModule, Module } from '@nestjs/common';

import { StripeCoreModule } from './stripe.core.module';

import { StripeAsyncOptions, StripeOptions } from './type';

@Module({})
export class StripeModule {
  public static forRoot(options: StripeOptions): DynamicModule {
    if (process.env.MIGRATION === 'true') {
      // When custom (JS) migrations running (CI/CD), there is no access to env credential variables.
      // Therefore at the stage of the migrations, all third-party providers are uninitialized, and no provider accessible via DI.
      return {
        module: StripeModule,
        imports: [],
        exports: [],
        providers: [],
      };
    }

    return {
      module: StripeModule,
      imports: [StripeCoreModule.forRoot(options)],
      exports: [],
      providers: [],
    };
  }

  public static forRootAsync(options: StripeAsyncOptions): DynamicModule {
    if (process.env.MIGRATION === 'true') {
      // When custom (JS) migrations running (CI/CD), there is no access to env credential variables.
      // Therefore at the stage of the migrations, all third-party providers are uninitialized, and no provider accessible via DI.
      return {
        module: StripeModule,
        imports: [],
        exports: [],
        providers: [],
      };
    }

    return {
      module: StripeModule,
      imports: [StripeCoreModule.forRootAsync(options)],
      exports: [],
      providers: [],
    };
  }
}
