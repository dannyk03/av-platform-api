import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionNames } from '@/database';
import { AcpPolicy } from './entity/acp-policy.entity';
import { AcpPolicyService } from './service/acp-policy.service';

@Module({
  imports: [TypeOrmModule.forFeature([AcpPolicy], ConnectionNames.Default)],
  exports: [AcpPolicyService],
  providers: [AcpPolicyService],
  controllers: [],
})
export class AcpPolicyModule {}
