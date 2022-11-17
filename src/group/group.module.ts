import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@/user/user.module';

import { Group } from './entity';

import { GroupService } from './service';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group], ConnectionNames.Default),
    UserModule,
  ],
  exports: [GroupService],
  providers: [GroupService],
  controllers: [],
})
export class GroupModule {}
