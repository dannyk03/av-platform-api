import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, UserProfile } from './entity';

import { UserProfileService, UserService } from './service';

import { ConnectionNames } from '@/database';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile], ConnectionNames.Default),
  ],
  exports: [UserService, UserProfileService],
  providers: [UserService, UserProfileService],
  controllers: [],
})
export class UserModule {}
