import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';

import {
  EnumAddGroupMemberType,
  EnumGroupInviteStatus,
  EnumGroupRole,
  EnumGroupStatusCodeError,
  EnumMessagingStatusCodeError,
  IResponseData,
  IResponsePagingData,
} from '@avo/type';

import { isEmail } from 'class-validator';
import { DataSource, Equal } from 'typeorm';

import { GroupInviteMemberLink, GroupMember } from '../entity';
import { User } from '@/user/entity';

import {
  GroupInviteLinkService,
  GroupInviteMemberLinkService,
  GroupMemberService,
  GroupService,
} from '../service';
import { EmailService } from '@/messaging/email/service';
import { SocialConnectionService } from '@/networking/service';
import { UserService } from '@/user/service';
import {
  HelperDateService,
  HelperHashService,
  HelperPromiseService,
} from '@/utils/helper/service';
import { PaginationService } from '@/utils/pagination/service';

import { CanAccessGroupAsGroupMember } from '../decorator';
import { LogTrace } from '@/log/decorator';
import { ReqAuthUser } from '@/user/decorator';
import {
  ClientResponse,
  ClientResponsePaging,
} from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';
import { RequestParamGuard } from '@/utils/request/guard';

import { DeepPartial } from 'utility-types';

import {
  GroupCreateDto,
  GroupDesiredSkillsListDto,
  GroupFunFactsListDto,
  GroupListDto,
  GroupUpcomingMilestonesListDto,
  GroupUpdateDto,
  MemberListDto,
} from '../dto';
import {
  GroupInviteAcceptByIdDto,
  GroupInviteAcceptRefDto,
  GroupInviteListDto,
  GroupInviteMemberDto,
} from '@/group/dto';
import { UserListDto } from '@/user/dto';
import { IdParamDto } from '@/utils/request/dto';

import {
  GroupDesiredSkillsListSerialization,
  GroupFunFactsListSerialization,
  GroupGetSerialization,
  GroupGetWithPreviewSerialization,
  GroupUpcomingMilestonesListSerialization,
} from '../serialization';
import { GroupMembersListSerialization } from '../serialization/group.members.list.serialization';
import { GroupUserSerialization } from '@/group/serialization';
import { UserConnectionProfileGetSerialization } from '@/user/serialization';

import { ConnectionNames } from '@/database/constant';
import { EnumLogAction } from '@/log/constant';

@Controller({
  version: '1',
})
export class GroupCommonController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly groupService: GroupService,
    private readonly userService: UserService,
    private readonly groupMemberService: GroupMemberService,
    private readonly groupInviteMemberLinkService: GroupInviteMemberLinkService,
    private readonly groupInviteLinkService: GroupInviteLinkService,
    private readonly paginationService: PaginationService,
    private readonly socialConnectionService: SocialConnectionService,
    private readonly helperHashService: HelperHashService,
    private readonly helperDateService: HelperDateService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly helperPromiseService: HelperPromiseService,
  ) {}

  private async mapGroupInvitePromiseBasedResultToResponseReport(
    result: PromiseSettledResult<DeepPartial<GroupInviteMemberLink>>[],
  ) {
    return result.reduce((acc, promiseValue) => {
      if ('value' in promiseValue) {
        acc[
          promiseValue.value?.['inviteeUser']?.['email'] ||
            promiseValue.value?.['tempEmail'] ||
            // existing group member
            promiseValue.value?.['user']?.['email']
        ] = 'success';
      } else if ('reason' in promiseValue) {
        acc[
          promiseValue.reason?.['inviteeUser']?.['email'] ||
            promiseValue.reason?.['tempEmail'] ||
            // existing group member
            promiseValue.reason?.['user']?.['email']
        ] = 'fail';
      }
      return acc;
    }, {});
  }

  private async getGroupMembers(
    groupId: string,
    inviterUserId: string,
    count: number,
  ) {
    const inviterMember = await this.groupMemberService.findOne({
      where: {
        group: {
          id: groupId,
        },
        user: {
          id: inviterUserId,
        },
      },
      relations: ['user', 'user.profile'],
    });

    if (count == 1) {
      return [inviterMember];
    }

    const groupMembers = await this.groupMemberService.findRandomGroupMembers({
      groupId,
      count: --count,
      exclude: [inviterMember.id],
    });

    groupMembers.unshift(inviterMember);
    return groupMembers;
  }

  @ClientResponse('group.create', {
    classSerialization: GroupGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.CreateGroup, {
    tags: ['group', 'create'],
  })
  @AclGuard()
  @Post()
  async createGroup(
    @ReqAuthUser()
    reqAuthUser: User,
    @Body()
    { name, description }: GroupCreateDto,
  ): Promise<IResponseData> {
    const saveGroupRes = await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const createOwner = await this.groupMemberService.create({
          user: reqAuthUser,
          role: EnumGroupRole.Owner,
        });

        const createGroup = await this.groupService.create({
          name,
          description,
          members: [createOwner],
        });

        const savedGroup = await this.groupService.save(createGroup);

        const createInviteLink = await this.groupInviteLinkService.create({
          group: savedGroup,
        });

        await transactionalEntityManager.save(createInviteLink);

        return savedGroup;
      },
    );

    return saveGroupRes;
  }

  @ClientResponsePaging('group.inviteList')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get('/invite-list')
  async inviteList(
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
      status,
      type,
    }: GroupInviteListDto,
  ): Promise<IResponsePagingData> {
    const skip: number = await this.paginationService.skip(page, perPage);

    const invites = await this.groupInviteMemberLinkService.paginatedSearchBy({
      options: {
        skip: skip,
        take: perPage,
        order: sort,
      },
      status,
      search,
      type,
      userId,
    });

    const totalData = await this.groupInviteMemberLinkService.getTotal({
      status,
      search,
      type,
      userId,
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
      data: invites,
    };
  }

  @ClientResponse('group.active')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.UpdateGroup, {
    tags: ['group', 'active'],
  })
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Patch('active/:id')
  async activeGroup(
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
  async inactiveGroup(
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
  async updateGroup(
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
  async deleteGroup(
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

  @ClientResponsePaging('group.upcomingMilestones', {
    classSerialization: GroupUpcomingMilestonesListSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @CanAccessGroupAsGroupMember()
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Get('/:id/upcoming-milestones')
  async upcomingMilestones(
    @Param('id') groupId: string,
    @Query()
    { days, page, perPage }: GroupUpcomingMilestonesListDto,
  ): Promise<IResponseData> {
    const skip: number = page
      ? await this.paginationService.skip(page, perPage)
      : 0;

    const upcomingMilestones = await this.groupService.getUpcomingMilestones({
      groupId,
      days,
      skip,
      limit: perPage,
    });

    const totalData = upcomingMilestones?.length ?? 0;

    return {
      totalData,
      perPage,
      currentPage: perPage ? page : 0,
      period: `${days} days`,
      data: upcomingMilestones,
    };
  }

  @ClientResponsePaging('group.funFacts', {
    classSerialization: GroupFunFactsListSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @CanAccessGroupAsGroupMember()
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Get('/:id/fun-facts')
  async funFacts(
    @Param('id') groupId: string,
    @Query()
    { page, perPage }: GroupFunFactsListDto,
  ): Promise<IResponseData> {
    const skip: number = page
      ? await this.paginationService.skip(page, perPage)
      : 0;

    const funFacts = await this.groupService.getFunFacts({
      groupId,
      skip,
      limit: perPage,
    });

    const totalData = funFacts?.length ?? 0;

    return {
      totalData,
      perPage,
      currentPage: perPage ? page : 0,
      data: funFacts,
    };
  }

  @ClientResponsePaging('group.desiredSkills', {
    classSerialization: GroupDesiredSkillsListSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @CanAccessGroupAsGroupMember()
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Get('/:id/desired-skills')
  async desiredSkills(
    @Param('id') groupId: string,
    @Query()
    { page, perPage }: GroupDesiredSkillsListDto,
  ): Promise<IResponseData> {
    const skip: number = page
      ? await this.paginationService.skip(page, perPage)
      : 0;

    const desiredSkills = await this.groupService.getDesiredSkills({
      groupId,
      skip,
      limit: perPage,
    });

    const totalData = desiredSkills?.length ?? 0;

    return {
      totalData,
      perPage,
      currentPage: perPage ? page : 0,
      data: desiredSkills,
    };
  }

  @ClientResponsePaging('group.userSearch', {
    classSerialization: GroupUserSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get('/user-search')
  async userSearch(
    @ReqAuthUser()
    reqUser: User,
    @Query()
    { page, perPage, sort, search }: UserListDto,
  ): Promise<IResponseData> {
    const skip = await this.paginationService.skip(page, perPage);

    let users = await this.userService.paginatedSearchForGroup({
      options: {
        skip: skip,
        take: perPage,
        order: sort,
      },
      search,
    });

    if (!isEmail(search)) {
      users = await Promise.all(
        users.map(async (u) => {
          const isConnectedUser =
            await this.socialConnectionService.checkIsBiDirectionalSocialConnectedByEmails(
              {
                user1Email: reqUser.email,
                user2Email: u.email,
              },
            );
          return isConnectedUser;
        }),
      ).then((results) => users.filter((_, index) => results[index]));
    }

    return {
      currentPage: page,
      perPage,
      data: users,
    };
  }

  @ClientResponse('group.get', {
    classSerialization: GroupGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Get('/:id')
  async get(
    @ReqAuthUser()
    { id: userId }: User,
    @Param('id') groupId: string,
  ): Promise<IResponseData> {
    const findGroup = await this.groupService.findOne({
      where: {
        id: groupId,
        members: {
          user: {
            id: userId,
          },
        },
      },
      relations: {
        members: {
          user: true,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        createdAt: true,
        members: {
          id: true,
          user: {
            id: true,
          },
        },
      },
    });

    if (!findGroup) {
      throw new NotFoundException({
        statusCode: EnumGroupStatusCodeError.GroupNotFoundError,
        message: 'group.error.notFound',
      });
    }

    return findGroup;
  }

  @ClientResponse('group.getCode')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Get('/code/:id')
  async getInviteCode(@Param('id') groupId: string): Promise<IResponseData> {
    const findGroupLink = await this.groupInviteLinkService.findOne({
      where: {
        group: {
          id: groupId,
        },
      },
      relations: {
        group: true,
      },
      select: {
        id: true,
        code: true,
        group: {
          id: true,
        },
      },
    });

    if (!findGroupLink) {
      throw new NotFoundException({
        statusCode: EnumGroupStatusCodeError.GroupInviteNotFoundError,
        message: 'group.error.notFound',
      });
    }

    return findGroupLink;
  }

  @ClientResponse('group.inviteAccept')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.GroupInviteAccept, {
    tags: ['group', 'invite', 'accept'],
  })
  @AclGuard()
  @Post('/invite-accept')
  // TODO:  will be refactored with the rest of the signup flows
  async inviteAccept(
    @ReqAuthUser()
    reqAuthUser: User,
    @Body() { inviteId }: GroupInviteAcceptByIdDto,
    @Query() { code, type }: GroupInviteAcceptRefDto,
  ): Promise<IResponseData> {
    const result = await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        if (inviteId) {
          const invite = await this.groupInviteMemberLinkService.findOne({
            where: {
              id: inviteId,
              status: EnumGroupInviteStatus.Pending,
            },
            relations: {
              group: true,
              inviteeUser: true,
            },
            select: {
              id: true,
              status: true,
              group: {
                id: true,
              },
              inviteeUser: {
                id: true,
              },
            },
          });

          if (!invite) {
            throw new BadRequestException({
              statusCode:
                EnumGroupStatusCodeError.GroupUnprocessableInviteError,
              message: 'group.error.unprocessable',
            });
          }

          const createGroupMember = await this.groupMemberService.create({
            role: EnumGroupRole.Basic,
            user: reqAuthUser,
            group: {
              id: invite.group.id,
            },
          });

          await transactionalEntityManager.update(
            GroupInviteMemberLink,
            { id: inviteId },
            {
              status: EnumGroupInviteStatus.Accepted,
              ...(!invite?.inviteeUser?.id && {
                inviteeUser: reqAuthUser,
              }),
            },
          );

          return transactionalEntityManager.save(createGroupMember);
        }
        if (type == EnumAddGroupMemberType.PersonalInvite) {
          const findGroupInviteMemberLink =
            await this.groupInviteMemberLinkService.findOne({
              where: [
                {
                  code,
                  status: EnumGroupInviteStatus.Pending,
                  inviteeUser: Equal(reqAuthUser.id),
                },
                {
                  code,
                  status: EnumGroupInviteStatus.Pending,
                  tempEmail: reqAuthUser.email,
                },
              ],
              relations: {
                group: true,
                inviteeUser: true,
              },
              select: {
                id: true,
                code: true,
                status: true,
                expiresAt: true,
                tempEmail: true,
                group: {
                  id: true,
                },
                inviteeUser: {
                  id: true,
                },
              },
            });

          if (!findGroupInviteMemberLink) {
            throw new BadRequestException({
              statusCode:
                EnumGroupStatusCodeError.GroupUnprocessableInviteError,
              message: 'group.error.invite.unprocessable',
            });
          }

          const now = this.helperDateService.create();
          const expiresAt = this.helperDateService.create({
            date: findGroupInviteMemberLink.expiresAt,
          });

          if (expiresAt && now > expiresAt) {
            throw new BadRequestException({
              statusCode: EnumGroupStatusCodeError.GroupInviteExpiredError,
              message: 'group.error.inviteExpired',
            });
          }
          const createGroupMember = await this.groupMemberService.create({
            role: EnumGroupRole.Basic,
            user: reqAuthUser,
            group: {
              id: findGroupInviteMemberLink.group.id,
            },
          });

          await transactionalEntityManager.update(
            GroupInviteMemberLink,
            { code },
            {
              status: EnumGroupInviteStatus.Accepted,
              ...(!findGroupInviteMemberLink?.inviteeUser?.id && {
                inviteeUser: reqAuthUser,
              }),
            },
          );

          return transactionalEntityManager.save(createGroupMember);
        } else {
          const findGroupInviteLink = await this.groupInviteLinkService.findOne(
            {
              where: { code },
              relations: {
                group: true,
              },
              select: {
                id: true,
                group: {
                  id: true,
                },
              },
            },
          );

          if (!findGroupInviteLink) {
            throw new BadRequestException({
              statusCode:
                EnumGroupStatusCodeError.GroupUnprocessableInviteError,
              message: 'group.error.invite.unprocessable',
            });
          }

          const createGroupMember = await this.groupMemberService.create({
            role: EnumGroupRole.Basic,
            user: {
              id: reqAuthUser.id,
            },
            group: {
              id: findGroupInviteLink?.group.id,
            },
          });

          return transactionalEntityManager.save(createGroupMember);
        }
      },
    );

    return { dev: result };
  }

  @ClientResponse('group.inviteReject')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.GroupInviteReject, {
    tags: ['group', 'invite', 'reject'],
  })
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Post('/invite-reject/:id')
  async inviteReject(
    @ReqAuthUser()
    reqAuthUser: User,
    @Param('id') inviteId: string,
  ): Promise<IResponseData> {
    const invite = await this.groupInviteMemberLinkService.findOne({
      where: {
        id: inviteId,
        status: EnumGroupInviteStatus.Pending,
        inviteeUser: Equal(reqAuthUser.id),
      },
    });

    if (!invite) {
      throw new BadRequestException({
        statusCode: EnumGroupStatusCodeError.GroupUnprocessableInviteError,
        message: 'group.error.unprocessable',
      });
    }

    const { affected } =
      await this.groupInviteMemberLinkService.updateInviteStatus({
        inviteId,
        inviteStatus: EnumGroupInviteStatus.Rejected,
      });

    return {
      dev: {
        affected,
      },
    };
  }

  @ClientResponse('group.inviteCancel')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.GroupInviteCancel, {
    tags: ['group', 'invite', 'cancel'],
  })
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Post('/invite-cancel/:id')
  async inviteCancel(
    @ReqAuthUser()
    reqAuthUser: User,
    @Param('id') inviteId: string,
  ): Promise<IResponseData> {
    const findInvite = await this.groupInviteMemberLinkService.findOne({
      where: {
        inviterUser: {
          id: reqAuthUser.id,
        },
        id: inviteId,
        status: EnumGroupInviteStatus.Pending,
      },
    });

    if (!findInvite) {
      throw new BadRequestException({
        statusCode: EnumGroupStatusCodeError.GroupUnprocessableInviteError,
        message: 'group.error.unprocessable',
      });
    }

    const { affected } =
      await this.groupInviteMemberLinkService.updateInviteStatus({
        inviteId,
        inviteStatus: EnumGroupInviteStatus.Canceled,
      });

    return {
      dev: {
        affected,
      },
    };
  }

  @ClientResponse('group.inviteResend')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.GroupInviteResend, {
    tags: ['group', 'invite', 'send'],
  })
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Post('/invite-resend/:id')
  async inviteResend(
    @ReqAuthUser()
    reqAuthUser: User,
    @Param('id') inviteId: string,
  ): Promise<IResponseData> {
    const findInvite = await this.groupInviteMemberLinkService.findOne({
      where: {
        id: inviteId,
        inviterUser: {
          id: reqAuthUser.id,
        },
        status: EnumGroupInviteStatus.Pending,
      },
      relations: {
        inviteeUser: {
          profile: true,
        },
        inviterUser: {
          profile: true,
        },
        group: true,
      },
      select: {
        id: true,
        tempEmail: true,
        group: {
          id: true,
          name: true,
        },
        inviteeUser: {
          id: true,
          email: true,
          profile: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        inviterUser: {
          id: true,
          email: true,
          profile: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!findInvite) {
      throw new BadRequestException({
        statusCode: EnumGroupStatusCodeError.GroupUnprocessableInviteError,
        message: 'group.error.invite.unprocessable',
      });
    }

    const { affected } = await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const expiresInDays = this.configService.get<number>(
          'group.groupInviteCodeExpiresInDays',
        );

        const inviteeUser = findInvite.inviteeUser;
        const inviterUser = findInvite.inviterUser;
        const group = findInvite.group;
        const code = findInvite.code;

        const groupMembers = await this.getGroupMembers(
          group.id,
          inviterUser.id,
          3,
        );

        const emailSent = inviteeUser
          ? await this.emailService.sendGroupInviteExistingUser({
              inviteeUser,
              inviterUser,
              group,
              code,
              groupMembers,
              expiresInDays,
            })
          : await this.emailService.sendGroupInviteNewUser({
              email: findInvite.tempEmail,
              inviterUser,
              group,
              code,
              groupMembers,
              expiresInDays,
            });

        if (!emailSent) {
          throw new InternalServerErrorException({
            statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
            message: 'messaging.error.email.send',
          });
        }

        return transactionalEntityManager.update(
          GroupInviteMemberLink,
          { id: inviteId },
          { expiresAt: this.helperDateService.forwardInDays(expiresInDays) },
        );
      },
    );

    return { dev: { affected } };
  }

  @ClientResponse('group.inviteMember')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.GroupInviteSend, {
    tags: ['group', 'invite', 'send'],
  })
  @AclGuard({
    relations: ['profile'],
  })
  @RequestParamGuard(IdParamDto)
  @Post('/:id/invite-member')
  async inviteMember(
    @ReqAuthUser()
    reqUser: User,
    @Body()
    { invitees }: GroupInviteMemberDto,
    @Param('id') groupId: string,
  ): Promise<IResponseData> {
    const findGroup = await this.groupService.findGroup({
      isOwner: false,
      groupId,
      userId: reqUser.id,
    });

    if (!findGroup) {
      throw new NotFoundException({
        statusCode: EnumGroupStatusCodeError.GroupNotFoundError,
        message: 'group.error.notFound',
      });
    }

    const result = await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const expiresInDays = this.configService.get<number>(
          'group.groupInviteCodeExpiresInDays',
        );

        const inviteMembersData = await Promise.all(
          invitees.map(async (invitee) => {
            const potentialMemberUser = await this.userService.findOne({
              where: {
                email: invitee.email,
              },
              relations: {
                profile: true,
              },
              select: {
                id: true,
                email: true,
                profile: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            });

            if (potentialMemberUser) {
              const existingMember = await this.groupMemberService.findOne({
                where: {
                  group: {
                    id: groupId,
                  },
                  user: {
                    id: potentialMemberUser.id,
                  },
                },
                relations: {
                  user: true,
                  group: true,
                },
                select: {
                  id: true,
                  role: true,
                  user: {
                    id: true,
                    email: true,
                  },
                  group: {
                    id: true,
                  },
                },
              });

              if (existingMember) {
                return Promise.resolve(existingMember);
              }
            }

            const existingInvite =
              await this.groupInviteMemberLinkService.findOne({
                where: {
                  status: EnumGroupInviteStatus.Pending,
                  group: {
                    id: groupId,
                  },
                  ...(potentialMemberUser
                    ? {
                        inviteeUser: {
                          id: potentialMemberUser?.id,
                        },
                      }
                    : { tempEmail: invitee.email }),
                },
                relations: {
                  group: true,
                  inviteeUser: true,
                },
                select: {
                  id: true,
                  code: true,
                  group: {
                    id: true,
                    name: true,
                  },
                  tempEmail: true,
                  inviterUser: {
                    email: true,
                    id: true,
                  },
                  inviteeUser: {
                    id: true,
                    email: true,
                  },
                },
              });

            if (existingInvite) {
              return Promise.resolve(existingInvite);
            }

            return Promise.resolve({
              inviteeUser: potentialMemberUser,
              tempEmail: potentialMemberUser ? null : invitee.email,
              group: findGroup,
              inviterUser: {
                id: reqUser.id,
                email: reqUser.email,
                profile: {
                  firstName: reqUser.profile?.firstName,
                  lastName: reqUser.profile?.lastName,
                },
              },
              role: EnumGroupRole.Basic,
              expiresAt: this.helperDateService.forwardInDays(expiresInDays),
            });
          }),
        );

        const {
          resolved,
          nonExistingUserInvitesData,
          existingUsersInvitesDat,
        } = inviteMembersData.reduce(
          (acc, curr) => {
            if (
              curr instanceof GroupInviteMemberLink ||
              curr instanceof GroupMember
            ) {
              acc.resolved.push(curr);
            } else if (Boolean(curr.tempEmail)) {
              acc.nonExistingUserInvitesData.push(curr);
            } else {
              acc.existingUsersInvitesDat.push(curr);
            }
            return acc;
          },
          {
            resolved: [],
            nonExistingUserInvitesData: [],
            existingUsersInvitesDat: [],
          },
        );

        const groupMembers = await this.getGroupMembers(groupId, reqUser.id, 3);

        const nonExistingUsersRes = await Promise.allSettled(
          nonExistingUserInvitesData.map(async (inviteData) => {
            const createInvite = await this.groupInviteMemberLinkService.create(
              inviteData,
            );

            const saveInvite = await transactionalEntityManager.save(
              createInvite,
            );

            const { id, code, inviteeUser, group, inviterUser, tempEmail } =
              saveInvite;

            const emailSent = await this.emailService.sendGroupInviteNewUser({
              email: createInvite.tempEmail,
              inviterUser,
              group,
              code,
              groupMembers,
              expiresInDays,
            });

            const inviteDate = {
              id,
              code,
              inviteeUser,
              inviterUser,
              group,
              tempEmail,
            };

            if (!emailSent) {
              return Promise.reject(inviteDate);
            }
            return Promise.resolve(inviteDate);
          }),
        );

        const existingUsersRes = await Promise.allSettled(
          existingUsersInvitesDat.map(async (inviteData) => {
            const createInvite = await this.groupInviteMemberLinkService.create(
              inviteData,
            );

            const saveInvite = await transactionalEntityManager.save(
              createInvite,
            );

            const emailSent =
              await this.emailService.sendGroupInviteExistingUser({
                inviteeUser: saveInvite.inviteeUser,
                inviterUser: reqUser,
                group: saveInvite.group,
                code: saveInvite.code,
                groupMembers,
                expiresInDays,
              });

            if (!emailSent) {
              return Promise.reject(saveInvite);
            }
            return Promise.resolve(saveInvite);
          }),
        );

        const resolvedRes = await Promise.allSettled(
          resolved.map((inviteData) => Promise.resolve(inviteData)),
          // It's possible to resend email here, skip for now if already email sent once
        );

        return { resolvedRes, existingUsersRes, nonExistingUsersRes };
      },
    );

    return {
      ...(await this.mapGroupInvitePromiseBasedResultToResponseReport(
        result.nonExistingUsersRes,
      )),
      ...(await this.mapGroupInvitePromiseBasedResultToResponseReport(
        result.existingUsersRes,
      )),
      ...(await this.mapGroupInvitePromiseBasedResultToResponseReport(
        result.resolvedRes,
      )),
      dev: [
        ...(await this.helperPromiseService.mapSettledPromiseData(
          result.nonExistingUsersRes,
        )),
        ...(await this.helperPromiseService.mapSettledPromiseData(
          result.existingUsersRes,
        )),
        ...(await this.helperPromiseService.mapSettledPromiseData(
          result.resolvedRes,
        )),
      ],
    };
  }

  @ClientResponsePaging('group.members', {
    classSerialization: GroupMembersListSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @CanAccessGroupAsGroupMember()
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Get('/:id/members')
  async groupMembers(
    @Param('id') groupId: string,
    @Query()
    { page, perPage, sort, search }: MemberListDto,
  ): Promise<IResponseData> {
    const skip = await this.paginationService.skip(page, perPage);

    const members = await this.groupMemberService.findGroupMembers({
      groupId,
      search,
      options: {
        skip: skip,
        take: perPage,
        order: sort,
      },
    });

    return {
      currentPage: page,
      perPage,
      data: members,
    };
  }

  @ClientResponse('group.member', {
    classSerialization: UserConnectionProfileGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @CanAccessGroupAsGroupMember()
  @AclGuard({
    relations: ['profile'],
  })
  @RequestParamGuard(IdParamDto)
  @Get('/:id/members/:memberId')
  async getConnectionProfile(
    @Param('memberId') memberId: string,
  ): Promise<IResponseData> {
    const member = await this.groupMemberService.findGroupMemberById(memberId);

    return member.user;
  }
}
