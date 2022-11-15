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

import { UserProfileDto } from '@/auth/dto';
import { IdParamDto } from '@/utils/request/dto';

import {
  UserConnectionProfileGetSerialization,
  UserProfileGetSerialization,
} from '../serialization';

import { ConnectionNames } from '@/database/constant';
import { EnumLogAction } from '@/log/constant';

@Controller({
  version: '1',
})
export class UserCommonController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
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
  @Put('/profile')
  async updateUserProfile(
    @ReqUser()
    reqUser: User,
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
    this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .getRepository(User)
          .createQueryBuilder()
          .update<User>(User, {
            email,
            phoneNumber,
          })
          .where('id = :userId', { userId: reqUser.id })
          .execute();

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
            workAnniversaryMonth,
            workAnniversaryDay,
            kidFriendlyActivities,
            funFacts,
            desiredSkills,
          })
          .where('id = :userProfileId', { userProfileId: reqUser.profile.id })
          .execute();

        await transactionalEntityManager
          .getRepository(UserProfileHome)
          .createQueryBuilder()
          .update<UserProfileHome>(UserProfileHome, home)
          .where('user_profile_id = :userProfileId', {
            userProfileId: reqUser.profile.id,
          })
          .execute();

        await transactionalEntityManager
          .getRepository(UserProfileShipping)
          .createQueryBuilder()
          .update<UserProfileShipping>(UserProfileShipping, shipping)
          .where('user_profile_id = :userProfileId', {
            userProfileId: reqUser.profile.id,
          })
          .execute();
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
