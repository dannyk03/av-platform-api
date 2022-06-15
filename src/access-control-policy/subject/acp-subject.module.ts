import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionNames } from '@/database';
import { AcpSubject } from './entity/acp-subject.entity';
import { AcpSubjectService } from './service/acp-subject.service';

@Module({
  imports: [TypeOrmModule.forFeature([AcpSubject], ConnectionNames.Default)],
  exports: [AcpSubjectService],
  providers: [AcpSubjectService],
  controllers: [],
})
export class AcpSubjectModule {}
