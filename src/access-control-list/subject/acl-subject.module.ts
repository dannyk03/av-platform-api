import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionNames } from '@/database';
import { AclSubject } from './entity/acl-subject.entity';
import { AclSubjectService } from './service/acl-subject.service';

@Module({
  imports: [TypeOrmModule.forFeature([AclSubject], ConnectionNames.Default)],
  exports: [AclSubjectService],
  providers: [AclSubjectService],
  controllers: [],
})
export class AclSubjectModule {}
