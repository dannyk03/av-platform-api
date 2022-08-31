import { DynamicModule, Global, Module } from '@nestjs/common';

import { WinstonModule } from 'nest-winston';

import { DebuggerOptionService, DebuggerService } from './service';

@Global()
@Module({
  providers: [DebuggerOptionService, DebuggerService],
  exports: [DebuggerOptionService, DebuggerService],
  imports: [],
})
export class DebuggerModule {}

@Module({})
export class DebuggerModuleDynamic {
  static register(): DynamicModule {
    if (process.env.APP_ENV === 'production' && process.env.CI === 'false') {
      return {
        module: DebuggerModuleDynamic,
        providers: [],
        exports: [],
        controllers: [],
        imports: [],
      };
    }

    return {
      module: DebuggerModuleDynamic,
      imports: [
        DebuggerModule,
        WinstonModule.forRootAsync({
          imports: [DebuggerModule],
          inject: [DebuggerOptionService],
          useFactory: (debuggerOptionService: DebuggerOptionService) =>
            debuggerOptionService.createLogger(),
        }),
      ],
      providers: [],
    };
  }
}
