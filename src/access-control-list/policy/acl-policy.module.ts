import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { AclPolicy } from './entity';
// Services
import { AclPolicyService } from './service';
//
import { ConnectionNames } from '@/database';

@Module({
  imports: [TypeOrmModule.forFeature([AclPolicy], ConnectionNames.Default)],
  exports: [AclPolicyService],
  providers: [AclPolicyService],
  controllers: [],
})
export class AclPolicyModule {}
