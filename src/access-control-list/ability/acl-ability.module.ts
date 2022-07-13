import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionNames } from '@/database';
import { AclAbility } from './entity';
import { AclAbilityService } from './service/acl-ability.service';

@Module({
  imports: [TypeOrmModule.forFeature([AclAbility], ConnectionNames.Default)],
  exports: [AclAbilityService],
  providers: [AclAbilityService],
  controllers: [],
})
export class AclAbilityModule {}
