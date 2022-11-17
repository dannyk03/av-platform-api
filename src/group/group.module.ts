import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@/user/user.module';

import { Group } from './entity';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group], ConnectionNames.Default),
    UserModule,
  ],
  exports: [],
  providers: [],
  controllers: [],
})
export class GroupModule {}
