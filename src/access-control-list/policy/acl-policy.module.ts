import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AclPolicy } from './entity';

import { AclPolicyService } from './service';

import { ConnectionNames } from '@/database';

@Module({
  imports: [TypeOrmModule.forFeature([AclPolicy], ConnectionNames.Default)],
  exports: [AclPolicyService],
  providers: [AclPolicyService],
  controllers: [],
})
export class AclPolicyModule {}
