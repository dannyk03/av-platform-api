import { Global, Module } from '@nestjs/common';

import { DebuggerOptionService, DebuggerService } from './service';

@Global()
@Module({
  providers: [DebuggerOptionService, DebuggerService],
  exports: [DebuggerOptionService, DebuggerService],
  imports: [],
})
export class DebuggerModule {}
