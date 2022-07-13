import { Module } from '@nestjs/common';

import { ConnectionNames } from '@/database';
import { TypeOrmModule } from '@nestjs/typeorm';
// Services
import { UserService } from './service/user.service';
// Entities
import { User } from './entity';
//

@Module({
  imports: [TypeOrmModule.forFeature([User], ConnectionNames.Default)],
  exports: [UserService],
  providers: [UserService],
  controllers: [],
})
export class UserModule {}
