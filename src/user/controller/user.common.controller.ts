import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';

import { EnumUserStatusCodeError, IResponseData } from '@avo/type';

import { User } from '../entity';

import { SocialConnectionService } from '@/networking/service';

import { ReqUser } from '../decorator/user.decorator';
import { LogTrace } from '@/log/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';
import { RequestParamGuard } from '@/utils/request/guard';

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
    private readonly socialConnectionService: SocialConnectionService,
  ) {}

  @ClientResponse('user.profile', {
    classSerialization: UserProfileGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.UserProfileRequest, {
    tags: ['user', 'profile'],
  })
  @AclGuard({
    relations: [
      'profile',
      'profile.home',
      'profile.shipping',
      'invitationLink',
    ],
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
  @LogTrace(EnumLogAction.UserProfileRequest, {
    tags: ['user', 'profile'],
  })
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
      relations: [
        'user1',
        'user1.profile',
        'user1.profile.home',
        'user1.profile.shipping',
      ],
    });

    if (!socialConnection?.user1) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.UserProfileForbiddenError,
        message: 'user.error.profileForbidden',
      });
    }

    return socialConnection?.user1;
  }
}
