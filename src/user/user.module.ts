import { Module } from '@nestjs/common';

import { UserService } from './service/user.service';
import { UserBulkService } from './service/user.bulk.service';
import { User } from './entity/user.entity';
import { ConnectionNames } from '@/database';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User], ConnectionNames.Default)],
  exports: [UserService, UserBulkService],
  providers: [UserService, UserBulkService],
  controllers: [],
})
export class UserModule {}
