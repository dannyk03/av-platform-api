import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@/user/user.module';

import {
  Friendship,
  FriendshipRequest,
  FriendshipRequestBlock,
} from './entity';

import {
  FriendshipRequestBlockService,
  FriendshipRequestService,
  FriendshipService,
} from './service';

import { ConnectionNames } from '@/database';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Friendship, FriendshipRequest, FriendshipRequestBlock],
      ConnectionNames.Default,
    ),
    UserModule,
  ],

  exports: [
    FriendshipService,
    FriendshipRequestService,
    FriendshipRequestBlockService,
  ],
  providers: [
    FriendshipService,
    FriendshipRequestService,
    FriendshipRequestBlockService,
  ],
  controllers: [],
})
export class NetworkingModule {}
