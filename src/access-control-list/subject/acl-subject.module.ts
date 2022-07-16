import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { AclSubject } from './entity';
// Services
import { AclSubjectService } from './service';
//
import { ConnectionNames } from '@/database';

@Module({
  imports: [TypeOrmModule.forFeature([AclSubject], ConnectionNames.Default)],
  exports: [AclSubjectService],
  providers: [AclSubjectService],
  controllers: [],
})
export class AclSubjectModule {}
