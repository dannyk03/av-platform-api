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
import { InjectDataSource } from '@nestjs/typeorm';

import { EnumUserStatusCodeError, IResponseData } from '@avo/type';

import { DataSource } from 'typeorm';

import {
  User,
  UserProfile,
  UserProfileHome,
  UserProfileShipping,
} from '../entity';

import { UserProfileService } from '../service';
import { SocialConnectionService } from '@/networking/service';
import { UserService } from '@/user/service/user.service';

import { ReqAuthUser } from '../decorator/user.decorator';
import { LogTrace } from '@/log/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';
import { RequestParamGuard } from '@/utils/request/guard';

import { UserProfileDto } from '@/user/dto';
import { IdParamDto } from '@/utils/request/dto';

import {
  UserConnectionProfileGetSerialization,
  UserProfileGetSerialization,
} from '../serialization';

import { ConnectionNames } from '@/database/constant';
import { EnumLogAction } from '@/log/constant';

import { DeepOmit, UnDot } from '@/utils/ts';

@Controller({
  version: '1',
})
export class UserCommonController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly socialConnectionService: SocialConnectionService,
    private readonly userService: UserService,
    private readonly userProfileService: UserProfileService,
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
    @ReqAuthUser()
    reqUser: User,
  ): Promise<IResponseData> {
    return reqUser;
  }

  @ClientResponse('user.profile', {
    classSerialization: UserProfileGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.UserProfileRequest, {
    tags: ['user', 'profile'],
  })
  @AclGuard({
    relations: ['profile'],
  })
  @Put('/profile')
  async updateUserProfile(
    @ReqAuthUser()
    reqUser: User,
    @Body()
    {
      personal: {
        firstName,
        lastName,
        birthMonth,
        birthDay,
        workAnniversaryYear,
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
    }: DeepOmit<
      DeepOmit<UserProfileDto, UnDot<'personal.email'>>,
      UnDot<'personal.phoneNumber'>
    >,
  ): Promise<IResponseData> {
    await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .getRepository(UserProfile)
          .createQueryBuilder()
          .update<UserProfile>(UserProfile, {
            firstName,
            lastName,
            personas,
            dietary,
            birthMonth,
            birthDay,
            workAnniversaryYear,
            workAnniversaryMonth,
            workAnniversaryDay,
            kidFriendlyActivities,
            funFacts,
            desiredSkills,
          })
          .where('id = :userProfileId', { userProfileId: reqUser.profile.id })
          .execute();

        if (home) {
          await transactionalEntityManager
            .getRepository(UserProfileHome)
            .createQueryBuilder()
            .update<UserProfileHome>(UserProfileHome, home)
            .where('user_profile_id = :userProfileId', {
              userProfileId: reqUser.profile.id,
            })
            .execute();
        }

        if (shipping) {
          await transactionalEntityManager
            .getRepository(UserProfileShipping)
            .createQueryBuilder()
            .update<UserProfileShipping>(UserProfileShipping, shipping)
            .where('user_profile_id = :userProfileId', {
              userProfileId: reqUser.profile.id,
            })
            .execute();
        }
      },
    );

    const user = await this.userService.findOne({
      where: {
        id: reqUser.id,
      },
      relations: ['profile', 'profile.home', 'profile.shipping'],
    });

    return user;
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
    @ReqAuthUser()
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
