import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConnectionNames } from '@/database';

import { User, UserProfile } from './entity';
import { UserService } from './service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile], ConnectionNames.Default),
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [],
})
export class UserModule {}
