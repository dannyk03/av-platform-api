import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AclSubjectService } from './service';

import { AclSubject } from './entity';

import { ConnectionNames } from '@/database';

@Module({
  imports: [TypeOrmModule.forFeature([AclSubject], ConnectionNames.Default)],
  exports: [AclSubjectService],
  providers: [AclSubjectService],
  controllers: [],
})
export class AclSubjectModule {}
