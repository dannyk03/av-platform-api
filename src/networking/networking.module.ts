import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@/user/user.module';

import {
  SocialConnection,
  SocialConnectionRequest,
  SocialConnectionRequestBlock,
} from './entity';

import {
  SocialConnectionRequestBlockService,
  SocialConnectionRequestService,
  SocialConnectionService,
  SocialNetworkingService,
} from './service';

import { ConnectionNames } from '@/database';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [SocialConnection, SocialConnectionRequest, SocialConnectionRequestBlock],
      ConnectionNames.Default,
    ),
    UserModule,
  ],

  exports: [
    SocialNetworkingService,
    SocialConnectionService,
    SocialConnectionRequestService,
    SocialConnectionRequestBlockService,
  ],
  providers: [
    SocialNetworkingService,
    SocialConnectionService,
    SocialConnectionRequestService,
    SocialConnectionRequestBlockService,
  ],
  controllers: [],
})
export class NetworkingModule {}
