import { Global, Module } from '@nestjs/common';
// Services
import { DebuggerOptionService, DebuggerService } from './service';
//

@Global()
@Module({
  providers: [DebuggerOptionService, DebuggerService],
  exports: [DebuggerOptionService, DebuggerService],
  imports: [],
})
export class DebuggerModule {}
