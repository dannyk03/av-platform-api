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
    SocialConnectionService,
    SocialConnectionRequestService,
    SocialConnectionRequestBlockService,
  ],
  providers: [
    SocialConnectionService,
    SocialConnectionRequestService,
    SocialConnectionRequestBlockService,
  ],
  controllers: [],
})
export class NetworkingModule {}
