import { Global, Module } from '@nestjs/common';
// Services
import { DebuggerService, DebuggerOptionService } from './service';
//

@Global()
@Module({
  providers: [DebuggerOptionService, DebuggerService],
  exports: [DebuggerOptionService, DebuggerService],
  imports: [],
})
export class DebuggerModule {}
