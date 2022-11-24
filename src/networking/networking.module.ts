import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@/user/user.module';

import {
  InvitationLink,
  SocialConnection,
  SocialConnectionRequest,
  SocialConnectionRequestBlock,
} from './entity';

import {
  InvitationLinkService,
  SocialConnectionRequestBlockService,
  SocialConnectionRequestService,
  SocialConnectionService,
  SocialNetworkingService,
} from './service';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        SocialConnection,
        SocialConnectionRequest,
        SocialConnectionRequestBlock,
        InvitationLink,
      ],
      ConnectionNames.Default,
    ),
    forwardRef(() => UserModule),
  ],

  exports: [
    SocialNetworkingService,
    InvitationLinkService,
    SocialConnectionService,
    SocialConnectionRequestService,
    SocialConnectionRequestBlockService,
  ],
  providers: [
    SocialNetworkingService,
    InvitationLinkService,
    SocialConnectionService,
    SocialConnectionRequestService,
    SocialConnectionRequestBlockService,
  ],
  controllers: [],
})
export class NetworkingModule {}
