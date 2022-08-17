import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { IResponseData } from '@avo/type';

import { User } from '@/user/entity';

import {
  FriendshipRequestBlockService,
  FriendshipRequestService,
  FriendshipService,
} from '../service';
import { UserService } from '@/user/service';

import { ConnectRequestDto } from '../dto';

import { AclGuard } from '@/auth';
import { EmailService } from '@/messaging/email';
import { ReqUser } from '@/user';
import { Response } from '@/utils/response';

@Controller({
  version: '1',
})
export class NetworkingCommonController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly friendshipService: FriendshipService,
    private readonly friendshipRequestService: FriendshipRequestService,
    private readonly friendshipRequestBlockService: FriendshipRequestBlockService,
  ) {}

  @Response('networking.connectRequest')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Post('/connect')
  async connect(
    @ReqUser()
    reqUser: User,
    @Body() { to }: ConnectRequestDto,
  ): Promise<IResponseData> {
    const promises = to.map(async (email) => {
      const addresseeUser = await this.userService.findOneBy({ email });

      if (!addresseeUser) {
        const isEmailSent = await this.emailService.sendNetworkJoinInvite({
          fromUser: reqUser,
          email,
        });

        if (isEmailSent) {
          const createFriendshipRequest =
            await this.friendshipRequestService.create({
              requestedUser: reqUser,
              tempAddresseeEmail: addresseeUser ? null : email,
            });

          return this.friendshipRequestService.save(createFriendshipRequest);
        } else {
          return Promise.reject(email);
        }
      }

      const createFriendshipRequest =
        await this.friendshipRequestService.create({
          requestedUser: reqUser,
          addresseeUser,
        });

      return this.friendshipRequestService.save(createFriendshipRequest);
    });

    return Promise.allSettled(promises);
  }
}
