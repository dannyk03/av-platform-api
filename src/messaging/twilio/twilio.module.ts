import { DynamicModule, Module } from '@nestjs/common';

import { TwilioCoreModule } from './twilio.core.module';

import { TwilioAsyncOptions, TwilioOptions } from './type';

@Module({})
export class TwilioModule {
  public static forRoot(options: TwilioOptions): DynamicModule {
    if (process.env.MIGRATION === 'true') {
      // When custom (JS) migrations running (CI/CD), there is no access to env credential variables.
      // Therefore at the stage of the migrations, all third-party providers are uninitialized, and no provider accessible via DI.
      return {
        module: TwilioModule,
        imports: [],
        exports: [],
        providers: [],
      };
    }

    return {
      module: TwilioModule,
      imports: [TwilioCoreModule.forRoot(options)],
      exports: [],
      providers: [],
    };
  }

  public static forRootAsync(options: TwilioAsyncOptions): DynamicModule {
    if (process.env.MIGRATION === 'true') {
      // When custom (JS) migrations running (CI/CD), there is no access to env credential variables.
      // Therefore at the stage of the migrations, all third-party providers are uninitialized, and no provider accessible via DI.
      return {
        module: TwilioModule,
        imports: [],
        exports: [],
        providers: [],
      };
    }

    return {
      module: TwilioModule,
      imports: [TwilioCoreModule.forRootAsync(options)],
      exports: [],
      providers: [],
    };
  }
}
