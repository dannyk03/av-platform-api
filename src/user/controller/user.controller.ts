import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Action, Subjects } from '@avo/casl';
import { IResponseData } from '@avo/type';

import { User } from '../entity';

import { UserService } from '../service';
import { HelperDateService } from '@/utils/helper/service';
import { PaginationService } from '@/utils/pagination/service';
import { AclRoleService } from '@acl/role/service';

import {
  UserGetSerialization,
  UserProfileGetSerialization,
} from '../serialization';

import { ReqUser } from '../user.decorator';

import { UserListDto } from '../dto';
import { IdParamDto } from '@/utils/request/dto/id-param.dto';

import { AclGuard } from '@/auth';
import { RequestParamGuard } from '@/utils/request';
import { Response, ResponsePaging } from '@/utils/response';

@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly roleService: AclRoleService,
    private readonly helperDateService: HelperDateService,
    private readonly userService: UserService,
    private readonly paginationService: PaginationService,
  ) {}

  @Response('user.profile', { classSerialization: UserProfileGetSerialization })
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

  @ResponsePaging('user.list', { classSerialization: UserGetSerialization })
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

  @Response('user.delete')
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

  @Response('user.active')
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

  @Response('user.inactive')
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
}
