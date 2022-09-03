import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { IResponseData } from '@avo/type';

import { User } from '../entity';

import { ReqUser } from '../decorator/user.decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';

import { UserProfileGetSerialization } from '../serialization';

@Controller({
  version: '1',
})
export class UserCommonController {
  @ClientResponse('user.profile', {
    classSerialization: UserProfileGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    relations: ['profile'],
  })
  @Get('/profile')
  async getProfile(
    @ReqUser()
    reqUser: User,
  ): Promise<IResponseData> {
    return reqUser;
  }

  // @ClientResponse('networking.connectRequest')
  // @HttpCode(HttpStatus.OK)
  // @LogTrace(EnumLogAction.SendConnectionRequest, {
  //   tags: ['networking'],
  // })
  // @AclGuard()
  // @Post('/invite')
  // async connect(
  //   @ReqUser()
  //   reqUser: User,
  //   @Body()
  //   {
  //     addressees,
  //     personalNote: sharedPersonalNote,
  //   }: SocialConnectionRequestDto,
  // ): Promise<IResponseData> {
  //   const promises = addressees.map(async ({ email, personalNote }) => {
  //     if (email === reqUser.email) {
  //       return Promise.reject(email);
  //     }

  //     const [findExistingRequest, findBlockRequest] = await Promise.all([
  //       this.socialConnectionRequestService.findSocialConnectionRequestByStatus(
  //         {
  //           fromEmail: reqUser.email,
  //           toEmail: email,
  //           status: [
  //             EnumNetworkingConnectionRequestStatus.Approved,
  //             EnumNetworkingConnectionRequestStatus.Pending,
  //           ],
  //         },
  //       ),
  //       this.socialConnectionRequestBlockService.findBlockRequest({
  //         fromEmail: reqUser.email,
  //         toEmail: email,
  //       }),
  //     ]);

  //     if (findExistingRequest || findBlockRequest) {
  //       return Promise.resolve(email);
  //     }

  //     const addresseeUser = await this.userService.findOneBy({ email });

  //     const createSocialConnectionRequest =
  //       await this.socialConnectionRequestService.create({
  //         personalNote: personalNote || sharedPersonalNote,
  //         addressedUser: reqUser,
  //         addresseeUser,
  //         tempAddresseeEmail: addresseeUser ? null : email,
  //       });

  //     const saveSocialConnectionRequest =
  //       await this.socialConnectionRequestService.save(
  //         createSocialConnectionRequest,
  //       );

  //     if (saveSocialConnectionRequest) {
  //       const isEmailSent = addresseeUser
  //         ? await this.emailService.sendNetworkNewConnectionRequest({
  //             personalNote: saveSocialConnectionRequest.personalNote,
  //             fromUser: saveSocialConnectionRequest.addressedUser,
  //             email:
  //               saveSocialConnectionRequest.addresseeUser?.email ||
  //               saveSocialConnectionRequest.tempAddresseeEmail,
  //           })
  //         : await this.emailService.sendNetworkJoinInvite({
  //             personalNote: saveSocialConnectionRequest.personalNote,
  //             fromUser: saveSocialConnectionRequest.addressedUser,
  //             email:
  //               saveSocialConnectionRequest.addresseeUser?.email ||
  //               saveSocialConnectionRequest.tempAddresseeEmail,
  //           });

  //       if (isEmailSent) {
  //         return Promise.resolve(email);
  //       }
  //       return Promise.reject(email);
  //     } else {
  //       return Promise.reject(email);
  //     }
  //   });

  //   const result = await Promise.allSettled(promises);

  //   return this.helperPromiseService.mapPromiseBasedResultToResponseReport(
  //     result,
  //   );
  // }
}
