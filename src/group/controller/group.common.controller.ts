import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  EnumGroupRole,
  EnumGroupStatusCodeError,
  IResponseData,
  IResponsePagingData,
} from '@avo/type';

import { User } from '@/user/entity';

import { GroupMemberService, GroupService } from '../service';
import { PaginationService } from '@/utils/pagination/service';

import { LogTrace } from '@/log/decorator';
import { ReqAuthUser } from '@/user/decorator';
import {
  ClientResponse,
  ClientResponsePaging,
} from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';
import { RequestParamGuard } from '@/utils/request/guard';

import { GroupCreateDto, GroupListDto, GroupUpdateDto } from '../dto';
import { IdParamDto } from '@/utils/request/dto';

import {
  GroupGetSerialization,
  GroupGetWithPreviewSerialization,
} from '../serialization';

import { EnumLogAction } from '@/log/constant';

import { TimestampPipe } from '@/utils/date-time/pipes';

@Controller({
  version: '1',
})
export class GroupCommonController {
  constructor(
    private readonly groupService: GroupService,
    private readonly groupMemberService: GroupMemberService,
    private readonly paginationService: PaginationService,
  ) {}

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

    const createOwner = await this.groupMemberService.create({
      user: reqAuthUser,
      role: EnumGroupRole.Owner,
    });

    const createGroup = await this.groupService.create({
      name,
      description,
      members: [createOwner],
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
    @Param('id') groupId: string,
  ): Promise<IResponseData> {
    const findGroup = await this.groupService.findGroup({
      isOwner: true,
      userId,
      groupId,
    });

    if (!findGroup) {
      throw new NotFoundException({
        statusCode: EnumGroupStatusCodeError.GroupNotFoundError,
        message: 'group.error.notFound',
      });
    }

    const { affected } = await this.groupService.updateGroupActiveStatus({
      id: groupId,
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
    @Param('id') groupId: string,
  ): Promise<IResponseData> {
    const findGroup = await this.groupService.findGroup({
      isOwner: true,
      userId,
      groupId,
    });

    if (!findGroup) {
      throw new NotFoundException({
        statusCode: EnumGroupStatusCodeError.GroupNotFoundError,
        message: 'group.error.notFound',
      });
    }
    const { affected } = await this.groupService.updateGroupActiveStatus({
      id: groupId,
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
    @Param('id') groupId: string,
    @Body()
    body: GroupUpdateDto,
  ): Promise<IResponseData> {
    const findGroup = await this.groupService.findGroup({
      isOwner: true,
      userId,
      groupId,
    });

    if (!findGroup) {
      throw new NotFoundException({
        statusCode: EnumGroupStatusCodeError.GroupNotFoundError,
        message: 'group.error.notFound',
      });
    }

    return this.groupService.save({ ...findGroup, ...body });
  }

  @ClientResponse('group.delete')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.DeleteGroup, {
    tags: ['group', 'delete'],
  })
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Delete('/:id')
  async deleteProduct(
    @ReqAuthUser()
    { id: userId }: User,
    @Param('id') groupId: string,
  ): Promise<{ deleted: number }> {
    const findGroup = await this.groupService.findGroup({
      isOwner: true,
      userId,
      groupId,
    });

    if (!findGroup) {
      throw new NotFoundException({
        statusCode: EnumGroupStatusCodeError.GroupNotFoundError,
        message: 'group.error.notFound',
      });
    }
    const removeGroup = await this.groupService.removeGroupBy({ id: groupId });

    return { deleted: removeGroup ? 1 : 0 };
  }

  @ClientResponsePaging('group.list', {
    classSerialization: GroupGetWithPreviewSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get('/list')
  async list(
    @ReqAuthUser()
    { id: userId }: User,
    @Query()
    {
      page,
      perPage,
      sort,
      search,
      availableSort,
      availableSearch,
      isActive,
      preview: previewCount,
    }: GroupListDto,
  ): Promise<IResponsePagingData> {
    const skip: number = await this.paginationService.skip(page, perPage);

    let groups = await this.groupService.paginatedSearchBy({
      userId,
      options: {
        skip: skip,
        take: perPage,
        order: sort,
      },
      search,
      isActive,
    });

    if (previewCount) {
      // TODO Make it more efficient, rewrite when there is time for it
      const randomGroupMembers =
        previewCount > 1
          ? await Promise.all(
              groups.map((group) =>
                this.groupMemberService.findRandomGroupMembers({
                  groupId: group.id,
                  count: previewCount - group?.members?.length ?? 0,
                  exclude: group.members.map(({ id }) => id),
                }),
              ),
            )
          : null;

      groups = groups.map((group, i) => {
        (group as any).membersPreview = [
          ...group.members,
          ...(randomGroupMembers?.[i] ?? []),
        ];
        return group;
      });
    }

    const totalData = await this.groupService.getTotal({
      userId,
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
      data: groups,
    };
  }

  @ClientResponsePaging(
    'group.upcomingMilestones',
    // {classSerialization: GroupGetWithPreviewSerialization,}
  )
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Get('/:id/upcoming-milestones')
  async upcomingMilestones(
    @ReqAuthUser()
    { id: userId }: User,
    @Param('id') groupId: string,
    @Query('start', TimestampPipe())
    fromTimestamp: number,
    @Query('end', TimestampPipe(60)) toTimestamp: number,
  ): Promise<IResponseData> {
    const findGroup = await this.groupService.findGroup({
      userId,
      groupId,
    });

    if (!findGroup) {
      throw new NotFoundException({
        statusCode: EnumGroupStatusCodeError.GroupNotFoundError,
        message: 'group.error.notFound',
      });
    }

    return this.groupService.getUpcomingMilestones({
      groupId,
      days: 60,
    });
  }
}
