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

import { Action, Subjects } from '@avo/casl';
import { IResponseData } from '@avo/type';

import { UserService } from '../service';
import { PaginationService } from '@/utils/pagination/service';

import {
  ClientResponse,
  ClientResponsePaging,
} from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';
import { RequestParamGuard } from '@/utils/request/guard';

import { UserListDto } from '../dto';
import { IdParamDto } from '@/utils/request/dto';

import { UserGetSerialization } from '../serialization';

@Controller({
  version: '1',
})
export class UserSystemCommonController {
  constructor(
    private readonly userService: UserService,
    private readonly paginationService: PaginationService,
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
}
