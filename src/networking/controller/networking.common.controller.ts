import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import {
  EnumNetworkingConnectionRequestStatus,
  IResponseData,
} from '@avo/type';

import { In } from 'typeorm';

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
    private readonly friendshipRequestService: FriendshipRequestService,
    private readonly emailService: EmailService,
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

      // try {
      //   const pend = await this.friendshipRequestService.findPendingRequest({
      //     from: reqUser.email,
      //     to: email,
      //   });

      //   console.log(pend);
      // } catch (error) {
      //   console.log(error);
      // }

      // const xxx = await this.friendshipRequestService.findOne({
      //   where: [
      //     {
      //       tempAddresseeEmail: email,
      //       requestedUser: {
      //         id: reqUser.id,
      //       },
      //     },
      //     {
      //       addresseeUser: {
      //         email,
      //       },
      //       requestedUser: {
      //         id: reqUser.id,
      //       },
      //     },
      //   ],
      // });

      // const [findBlockRequest, findExistingRequest] = await Promise.all([
      //   this.friendshipRequestBlockService.findOne({
      //     where: {
      //       blockingUser: {
      //         email,
      //       },
      //       blockedUser: {
      //         id: reqUser.id,
      //       },
      //     },
      //   }),
      //   this.friendshipRequestService.findOne({
      //     where: [
      //       {
      //         status: In([
      //           EnumNetworkingConnectionRequestStatus.Pending,
      //           EnumNetworkingConnectionRequestStatus.Rejected,
      //         ]),
      //         tempAddresseeEmail: email,
      //         requestedUser: {
      //           id: reqUser.id,
      //         },
      //       },
      //       {
      //         status: In([
      //           EnumNetworkingConnectionRequestStatus.Pending,
      //           EnumNetworkingConnectionRequestStatus.Rejected,
      //         ]),
      //         addresseeUser: {
      //           email,
      //         },
      //         requestedUser: {
      //           id: reqUser.id,
      //         },
      //       },
      //     ],
      //   }),
      // ]);

      // if (findExistingRequest || findBlockRequest) {
      //   return Promise.resolve(email);
      // }

      // if (!addresseeUser) {
      //   const isEmailSent = await this.emailService.sendNetworkJoinInvite({
      //     fromUser: reqUser,
      //     email,
      //   });

      //   if (isEmailSent) {
      //     const createFriendshipRequest =
      //       await this.friendshipRequestService.create({
      //         addressedUser: reqUser,
      //         tempAddresseeEmail: addresseeUser ? null : email,
      //       });

      //     return this.friendshipRequestService.save(createFriendshipRequest);
      //   } else {
      //     return Promise.reject(email);
      //   }
      // }

      // const createFriendshipRequest =
      //   await this.friendshipRequestService.create({
      //     addressedUser: reqUser,
      //     addresseeUser,
      //   });

      // return this.friendshipRequestService.save(createFriendshipRequest);
    });

    const res = await Promise.allSettled(promises);
    return res;
  }
}
