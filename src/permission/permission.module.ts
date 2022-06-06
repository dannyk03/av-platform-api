import { ConnectionNames } from '@/database';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from './entity/permission.entity';
import { PermissionBulkService } from './service/permission.bulk.service';
import { PermissionService } from './service/permission.service';

@Module({
  controllers: [],
  providers: [PermissionService, PermissionBulkService],
  exports: [PermissionService, PermissionBulkService],
  imports: [
    TypeOrmModule.forFeature([PermissionEntity], ConnectionNames.Default),
  ],
})
export class PermissionModule {}
