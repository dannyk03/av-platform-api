import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Action, Subjects } from '@avo/casl';
import { EnumUserStatusCodeError, IResponseData } from '@avo/type';

import { User } from '../entity';

import { UserService } from '../service';
import { EmailService } from '@/messaging/email/service';
import { HelperPromiseService } from '@/utils/helper/service';
import { PaginationService } from '@/utils/pagination/service';

import { ReqUser } from '../decorator';
import { LogTrace } from '@/log/decorator';
import {
  ClientResponse,
  ClientResponsePaging,
} from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';
import { RequestParamGuard } from '@/utils/request/guard';

import { UserInviteDto, UserListDto } from '../dto';
import { IdParamDto } from '@/utils/request/dto';

import {
  UserGetSerialization,
  UserProfileGetSerialization,
} from '../serialization';

import { EnumLogAction } from '@/log/constant';

@Controller({
  version: '1',
})
export class UserSystemCommonController {
  constructor(
    private readonly userService: UserService,
    private readonly paginationService: PaginationService,
    private readonly emailService: EmailService,
    private readonly helperPromiseService: HelperPromiseService,
  ) {}

  @ClientResponsePaging('user.list', {
    classSerialization: UserGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Read,
        subject: Subjects.User,
      },
    ],
    systemOnly: true,
  })
  @Get('/list')
  async list(
    @Query()
    {
      page,
      perPage,
      sort,
      search,
      availableSort,
      availableSearch,
      isActive,
    }: UserListDto,
  ): Promise<IResponseData> {
    const skip = await this.paginationService.skip(page, perPage);

    const users = await this.userService.paginatedSearchBy({
      options: {
        skip: skip,
        take: perPage,
        order: sort,
      },
      search,
      isActive,
    });

    const totalData = await this.userService.getTotal({
      search,
      isActive,
    });

    const totalPage: number = await this.paginationService.totalPage(
      totalData,
      perPage,
    );

    return {
      totalData,
      totalPage,
      currentPage: page,
      perPage,
      availableSearch,
      availableSort,
      data: users,
    };
  }

  @ClientResponse('user.delete')
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Delete,
        subject: Subjects.User,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Delete('delete/:id')
  async removeUser(@Param('id') id: string): Promise<void> {
    await this.userService.removeUserBy({ id });
  }

  @ClientResponse('user.active')
  @AclGuard({
    abilities: [
      {
        action: Action.Update,
        subject: Subjects.User,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Patch('active/:id')
  async activeUser(@Param('id') id: string): Promise<IResponseData> {
    const { affected } = await this.userService.updateUserActiveStatus({
      id,
      isActive: true,
    });

    return {
      updated: affected,
    };
  }

  @ClientResponse('user.inactive')
  @AclGuard({
    abilities: [
      {
        action: Action.Update,
        subject: Subjects.User,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Patch('inactive/:id')
  async inactiveUser(@Param('id') id: string): Promise<IResponseData> {
    const { affected } = await this.userService.updateUserActiveStatus({
      id,
      isActive: false,
    });

    return {
      updated: affected,
    };
  }

  @ClientResponse('user.profile', {
    classSerialization: UserProfileGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Read,
        subject: Subjects.User,
      },
    ],
    systemOnly: true,
  })
  @RequestParamGuard(IdParamDto)
  @Get('/profile/:id')
  async getUserProfile(@Param('id') userId: string): Promise<IResponseData> {
    const findUser = await this.userService.findOne({
      where: { id: userId },
      relations: ['profile', 'profile.home', 'profile.shipping'],
    });

    if (!findUser) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.UserNotFoundError,
        message: 'user.error.notFound',
      });
    }

    return findUser;
  }

  @ClientResponse('user.invite')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.SendConnectionRequest, {
    tags: ['user', 'invite'],
  })
  @AclGuard({
    systemOnly: true,
  })
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
