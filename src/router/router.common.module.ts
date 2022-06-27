import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
// Modules
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { HealthModule } from '@/health/health.module';
// Controllers
import { AuthCommonController } from '@/auth/controller';
import { HealthController } from '@/health/controller';

@Module({
  controllers: [AuthCommonController, HealthController],
  providers: [],
  exports: [],
  imports: [UserModule, AuthModule, TerminusModule, HttpModule, HealthModule],
})
export class RouterCommonModule {}
