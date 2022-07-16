import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { AclAbility } from './entity';
// Services
import { AclAbilityService } from './service';
//
import { ConnectionNames } from '@/database';
@Module({
  imports: [TypeOrmModule.forFeature([AclAbility], ConnectionNames.Default)],
  exports: [AclAbilityService],
  providers: [AclAbilityService],
  controllers: [],
})
export class AclAbilityModule {}
