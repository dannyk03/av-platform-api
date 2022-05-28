import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule, HealthController } from '@/health';

@Module({
  controllers: [HealthController],
  providers: [],
  exports: [],
  imports: [TerminusModule, HttpModule, HealthModule],
})
export class RouterHealthModule {}
