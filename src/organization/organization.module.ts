import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entity/organization.entity';
import { ConnectionNames } from '@/database';

@Module({
  imports: [TypeOrmModule.forFeature([Organization], ConnectionNames.Default)],
  exports: [],
  providers: [],
  controllers: [],
})
export class OrganizationModule {}
