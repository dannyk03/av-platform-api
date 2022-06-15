import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionNames } from '@/database';
import { AcpRole } from './entity/acp-role.entity';
import { AcpRoleService } from './service/acp-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([AcpRole], ConnectionNames.Default)],
  exports: [AcpRoleService],
  providers: [AcpRoleService],
  controllers: [],
})
export class AcpRoleModule {}
