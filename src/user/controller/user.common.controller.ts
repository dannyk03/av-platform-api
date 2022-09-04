import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import {
  EnumNetworkingConnectionRequestStatus,
  IResponseData,
} from '@avo/type';

import { User } from '../entity';

import { UserService } from '../service';
import { EmailService } from '@/messaging/email/service';
import { SocialConnectionRequestService } from '@/networking/service';
import { HelperPromiseService } from '@/utils/helper/service';

import { ReqUser } from '../decorator/user.decorator';
import { LogTrace } from '@/log/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';

import { UserInviteDto } from '../dto';

import { UserProfileGetSerialization } from '../serialization';

import { EnumLogAction } from '@/log/constant';

@Controller({
  version: '1',
})
export class UserCommonController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly helperPromiseService: HelperPromiseService,
    private readonly socialConnectionRequestService: SocialConnectionRequestService,
  ) {}

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

  @ClientResponse('user.invite')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.SendConnectionRequest, {
    tags: ['user', 'invite'],
  })
  @AclGuard()
  @Post('/invite')
  async generalInvite(
    @ReqUser()
    reqUser: User,
    @Body()
    { addressees, personalNote: sharedPersonalNote }: UserInviteDto,
  ): Promise<IResponseData> {
    const promises = addressees.map(async ({ email, personalNote }) => {
      if (email === reqUser.email) {
        return Promise.reject(email);
      }

      const isEmailSent = await this.emailService.sendNetworkJoinInvite({
        personalNote: personalNote || sharedPersonalNote,
        fromUser: reqUser,
        email,
      });

      if (isEmailSent) {
        return Promise.resolve(email);
      }
      return Promise.reject(email);
    });

    const result = await Promise.allSettled(promises);

    return this.helperPromiseService.mapPromiseBasedResultToResponseReport(
      result,
    );
  }
}
