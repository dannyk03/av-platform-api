import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AclPolicyService } from './service';

import { AclPolicy } from './entity';

import { ConnectionNames } from '@/database';

@Module({
  imports: [TypeOrmModule.forFeature([AclPolicy], ConnectionNames.Default)],
  exports: [AclPolicyService],
  providers: [AclPolicyService],
  controllers: [],
})
export class AclPolicyModule {}
