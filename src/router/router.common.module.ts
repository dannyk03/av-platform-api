import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule, HealthController } from '@/health';
import { AppController, AppService } from '@/app';

@Module({
  controllers: [HealthController, AppController],
  providers: [AppService],
  exports: [],
  imports: [TerminusModule, HttpModule, HealthModule],
})
export class RouterCommonModule {}
