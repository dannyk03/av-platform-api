import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './service';

import { User, UserProfile } from './entity';

import { ConnectionNames } from '@/database';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile], ConnectionNames.Default),
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [],
})
export class UserModule {}
