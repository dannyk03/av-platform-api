import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthModule } from '@/health/health.module';

import { HealthCommonController } from '@/health/controller';

@Module({
  controllers: [HealthCommonController],
  providers: [],
  exports: [],
  imports: [TerminusModule, HealthModule],
})
export class RouterHealthModule {}
