import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AclSubject } from './entity';

import { AclSubjectService } from './service';

import { ConnectionNames } from '@/database';

@Module({
  imports: [TypeOrmModule.forFeature([AclSubject], ConnectionNames.Default)],
  exports: [AclSubjectService],
  providers: [AclSubjectService],
  controllers: [],
})
export class AclSubjectModule {}
