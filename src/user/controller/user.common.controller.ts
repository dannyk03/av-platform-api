import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { EnumUserStatusCodeError, IResponseData } from '@avo/type';

import { User } from '../entity';

import { UserService } from '../service';
import { EmailService } from '@/messaging/email/service';
import { SocialConnectionService } from '@/networking/service';
import { HelperPromiseService } from '@/utils/helper/service';

import { ReqUser } from '../decorator/user.decorator';
import { LogTrace } from '@/log/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';
import { RequestParamGuard } from '@/utils/request/guard';

import { UserInviteDto } from '../dto';
import { IdParamDto } from '@/utils/request/dto';

import {
  UserConnectionProfileGetSerialization,
  UserProfileGetSerialization,
} from '../serialization';

import { EnumLogAction } from '@/log/constant';

@Controller({
  version: '1',
})
export class UserCommonController {
  constructor(
    private readonly emailService: EmailService,
    private readonly helperPromiseService: HelperPromiseService,
    private readonly socialConnectionService: SocialConnectionService,
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

  @ClientResponse('user.profile', {
    classSerialization: UserConnectionProfileGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    relations: ['profile'],
  })
  @RequestParamGuard(IdParamDto)
  @Get('/profile/:id')
  async getConnectionProfile(
    @ReqUser()
    reqUser: User,
    @Param('id') connectionUserId: string,
  ): Promise<IResponseData> {
    const socialConnection = await this.socialConnectionService.findOne({
      where: {
        user1: {
          id: connectionUserId,
        },
        user2: {
          id: reqUser.id,
        },
      },
      relations: ['user1', 'user1.profile'],
    });

    if (!socialConnection?.user1) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.UserProfileForbiddenError,
        message: 'user.error.profileForbidden',
      });
    }

    return socialConnection?.user1;
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
