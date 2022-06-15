import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionNames } from '@/database';
import { AcpAbility } from './entity/acp-ability.entity';
import { AcpAbilityService } from './service/acp-ability.service';

@Module({
  imports: [TypeOrmModule.forFeature([AcpAbility], ConnectionNames.Default)],
  exports: [AcpAbilityService],
  providers: [AcpAbilityService],
  controllers: [],
})
export class AcpAbilityModule {}
