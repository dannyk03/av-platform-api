import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AclAbilityService } from './service';

import { AclAbility } from './entity';

import { ConnectionNames } from '@/database';

@Module({
  imports: [TypeOrmModule.forFeature([AclAbility], ConnectionNames.Default)],
  exports: [AclAbilityService],
  providers: [AclAbilityService],
  controllers: [],
})
export class AclAbilityModule {}
