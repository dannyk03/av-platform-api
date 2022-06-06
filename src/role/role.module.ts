import { ConnectionNames } from '@/database';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleEntity } from './entity/role.entity';
import { RoleBulkService } from './service/role.bulk.service';
import { RoleService } from './service/role.service';

@Module({
  controllers: [],
  providers: [RoleService, RoleBulkService],
  exports: [RoleService, RoleBulkService],
  imports: [TypeOrmModule.forFeature([RoleEntity], ConnectionNames.Default)],
})
export class RoleModule {}
