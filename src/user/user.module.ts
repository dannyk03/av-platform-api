import { Module } from '@nestjs/common';

import { ConnectionNames } from '@/database';
import { TypeOrmModule } from '@nestjs/typeorm';
// Services
import { UserService } from './service/user.service';
import { UserInviteService } from './service/user-invite.service';
// Entities
import { User } from './entity/user.entity';
import { UserInvite } from './entity/user-invite.entity';
//

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInvite], ConnectionNames.Default),
  ],
  exports: [UserService, UserInviteService],
  providers: [UserService, UserInviteService],
  controllers: [],
})
export class UserModule {}
