import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { EnumGroupStatusCodeError, IResponseData } from '@avo/type';

import { User } from '@/user/entity';

import { GroupService } from '../service';

import { LogTrace } from '@/log/decorator';
import { ReqAuthUser } from '@/user/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';
import { RequestParamGuard } from '@/utils/request/guard';

import { GroupCreateDto, GroupUpdateDto } from '../dto';
import { IdParamDto } from '@/utils/request/dto';

import { GroupGetSerialization } from '../serialization';

import { EnumLogAction } from '@/log/constant';

@Controller({
  version: '1',
})
export class GroupCommonController {
  constructor(private readonly groupService: GroupService) {}

  @ClientResponse('group.create', {
    classSerialization: GroupGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.CreateGroup, {
    tags: ['group', 'create'],
  })
  @AclGuard()
  @Post()
  async create(
    @ReqAuthUser()
    reqAuthUser: User,
    @Body()
    { name, description }: GroupCreateDto,
  ): Promise<IResponseData> {
    const isExists = await this.groupService.checkExistsByName(name);

    if (isExists) {
      throw new BadRequestException({
        statusCode: EnumGroupStatusCodeError.GroupExistsError,
        message: 'group.error.exists',
      });
    }

    const createGroup = await this.groupService.create({
      name,
      description,
      owner: {
        id: reqAuthUser.id,
      },
      users: [reqAuthUser],
    });

    return this.groupService.save(createGroup);
  }

  @ClientResponse('group.active')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.UpdateGroup, {
    tags: ['group', 'active'],
  })
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Patch('active/:id')
  async activeProduct(
    @ReqAuthUser()
    { id: userId }: User,
    @Param('id') id: string,
  ): Promise<IResponseData> {
    const findGroup = await this.groupService.findOne({
      where: {
        id,
        owner: {
          id: userId,
        },
      },
    });

    if (!findGroup) {
      throw new NotFoundException({
        statusCode: EnumGroupStatusCodeError.GroupNotFoundError,
        message: 'group.error.notFound',
      });
    }

    const { affected } = await this.groupService.updateGroupActiveStatus({
      id,
      isActive: true,
    });

    return {
      updated: affected,
    };
  }

  @ClientResponse('group.inactive')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.UpdateGroup, {
    tags: ['group', 'inactive'],
  })
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Patch('inactive/:id')
  async inactiveProduct(
    @ReqAuthUser()
    { id: userId }: User,
    @Param('id') id: string,
  ): Promise<IResponseData> {
    const findGroup = await this.groupService.findOne({
      where: {
        id,
        owner: {
          id: userId,
        },
      },
    });

    if (!findGroup) {
      throw new NotFoundException({
        statusCode: EnumGroupStatusCodeError.GroupNotFoundError,
        message: 'group.error.notFound',
      });
    }
    const { affected } = await this.groupService.updateGroupActiveStatus({
      id,
      isActive: false,
    });

    return {
      updated: affected,
    };
  }

  @ClientResponse('group.update', {
    classSerialization: GroupGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.UpdateGroup, {
    tags: ['group', 'update'],
  })
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Patch('/:id')
  async update(
    @ReqAuthUser()
    { id: userId }: User,
    @Param('id') id: string,
    @Body()
    body: GroupUpdateDto,
  ): Promise<IResponseData> {
    const findGroup = await this.groupService.findOne({
      where: {
        id,
        owner: {
          id: userId,
        },
      },
    });

    if (!findGroup) {
      throw new NotFoundException({
        statusCode: EnumGroupStatusCodeError.GroupNotFoundError,
        message: 'group.error.notFound',
      });
    }

    return this.groupService.save({ ...findGroup, ...body });
  }
}
