import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entity/organization.entity';
import { ConnectionNames } from '@/database';
import { OrganizationService } from './service/organization.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization], ConnectionNames.Default)],
  exports: [OrganizationService],
  providers: [OrganizationService],
  controllers: [],
})
export class OrganizationModule {}
