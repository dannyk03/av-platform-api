import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';

import { Action, Subjects } from '@avo/casl';
import { EnumUserStatusCodeError, IResponseData } from '@avo/type';

import { User } from '../entity';

import { EmailService } from '@/messaging/email/service';
import { SocialConnectionService } from '@/networking/service';
import { UserProfileService } from '@/user/service/user-profile.service';
import { UserService } from '@/user/service/user.service';
import { HelperPromiseService } from '@/utils/helper/service';

import { ReqUser } from '../decorator/user.decorator';
import { LogTrace } from '@/log/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';
import { RequestParamGuard } from '@/utils/request/guard';

import { DeepPartial } from 'utility-types';

import { AuthSignUpDto, UserProfileDto } from '@/auth/dto';
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
    private readonly userProfileService: UserProfileService,
    private readonly userService: UserService,
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

  // @ClientResponse('user.profile', {
  //   classSerialization: UserConnectionProfileGetSerialization,
  // })
  // @HttpCode(HttpStatus.OK)
  // @LogTrace(EnumLogAction.UserProfileRequest, {
  //   tags: ['user', 'profile'],
  // })
  @AclGuard({
    relations: ['profile'],
  })
  @Put('/profile')
  async updateUserProfile(
    @ReqUser()
    reqUser: User,
    // @Param('id') connectionUserId: string,
    @Body()
    {
      personal: {
        email,
        phoneNumber,
        firstName,
        lastName,
        birthMonth,
        birthDay,
        workAnniversaryMonth,
        workAnniversaryDay,
        kidFriendlyActivities,
        home,
        shipping,
        funFacts,
        desiredSkills,
      },
      personas,
      dietary,
    }: UserProfileDto,
  ): Promise<IResponseData> {
    const user = await this.userService.findOne({
      where: {
        id: reqUser.id,
      },
      relations: [
        'profile',
        // 'profile.home',
        // 'profile.shipping'
      ],
    });

    // const userProfile = Object.assign(user.profile, {
    //     firstName,
    //     lastName,
    //     // home,
    //     // shipping,
    //     personas,
    //     dietary,
    //     birthMonth,
    //     birthDay,
    //     workAnniversaryMonth,
    //     workAnniversaryDay,
    //     kidFriendlyActivities,
    //     funFacts,
    //     desiredSkills,
    //   }
    // );

    const cloned = Object.assign({}, user.profile);

    const profile = await this.userProfileService.findOne({
      where: { id: '9c0e9f4a-1d1c-48b6-8b26-9a0e972de9da' },
    });
    try {
      await this.userProfileService.save(cloned);
    } catch (err) {
      const a = 'a';
    }

    return profile;
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
