import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NetworkingModule } from '@/networking/networking.module';
import { UserModule } from '@/user/user.module';

import { Group, GroupMember } from './entity';

import { GroupMemberService, GroupService } from './service';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupMember], ConnectionNames.Default),
    UserModule,
    NetworkingModule,
  ],
  exports: [GroupService, GroupMemberService],
  providers: [GroupService, GroupMemberService],
  controllers: [],
})
export class GroupModule {}
