import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConnectionNames } from '@/database';

import { AclPolicy } from './entity';
import { AclPolicyService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([AclPolicy], ConnectionNames.Default)],
  exports: [AclPolicyService],
  providers: [AclPolicyService],
  controllers: [],
})
export class AclPolicyModule {}
