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

import { isEmail, isString } from 'class-validator';
import { DataSource } from 'typeorm';

import { GroupInviteMember, GroupMember } from '../entity';
import { User } from '@/user/entity';

import {
  GroupInviteLinkService,
  GroupInviteMemberService,
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

import { CanAccessAsGroupMember } from '../decorator';
import { LogTrace } from '@/log/decorator';
import { ReqAuthUser } from '@/user/decorator';
import {
  ClientResponse,
  ClientResponsePaging,
} from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';
import { RequestParamGuard } from '@/utils/request/guard';

import {
  GroupCreateDto,
  GroupDesiredSkillsListDto,
  GroupFunFactsListDto,
  GroupListDto,
  GroupUpcomingMilestonesListDto,
  GroupUpdateDto,
} from '../dto';
import { GroupInviteAcceptRefDto } from '../dto/group.add-member.dto';
import { GroupInviteListDto } from '../dto/group.invite-member-list.dto';
import { GroupInviteMemberDto } from '../dto/group.invite-member.dto';
import { UserListDto } from '@/user/dto';
import { IdParamDto } from '@/utils/request/dto';

import {
  GroupDesiredSkillsListSerialization,
  GroupFunFactsListSerialization,
  GroupGetSerialization,
  GroupGetWithPreviewSerialization,
  GroupInviteListSerialization,
  GroupUpcomingMilestonesListSerialization,
} from '../serialization';
import { GroupUserSerialization } from '@/group/serialization';

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
    private readonly groupInviteMemberService: GroupInviteMemberService,
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
    result: PromiseSettledResult<GroupInviteMember>[],
  ) {
    return result.reduce((acc, promiseValue) => {
      if ('value' in promiseValue) {
        acc[
          promiseValue.value?.['inviteeUser']?.['email'] ||
            promiseValue.value?.['tempEmail']
        ] = 'success';
      } else if ('reason' in promiseValue) {
        acc[
          promiseValue.reason?.['inviteeUser']?.['email'] ||
            promiseValue.reason?.['tempEmail']
        ] = 'fail';
      }
      return acc;
    }, {});
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

        const createInviteLink = await this.groupInviteLinkService.create({
          group: createGroup,
        });

        await transactionalEntityManager.save(createInviteLink);

        return createInviteLink.group;
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

    const invites = await this.groupInviteMemberService.paginatedSearchBy({
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

    const totalData = await this.groupInviteMemberService.getTotal({
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

  @ClientResponsePaging('group.upcomingMilestones', {
    classSerialization: GroupUpcomingMilestonesListSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @CanAccessAsGroupMember()
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
  @CanAccessAsGroupMember()
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
  @CanAccessAsGroupMember()
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
            await this.socialConnectionService.checkIsBiDirectionalSocialConnected(
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

  @ClientResponse('group.inviteAccept')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Post('/invite-accept')
  async inviteAccept(
    @ReqAuthUser()
    reqAuthUser: User,
    @Query() { code, type }: GroupInviteAcceptRefDto,
  ): Promise<IResponseData> {
    const groupInviteMemberLink = await this.groupInviteMemberService.findOne({
      where: [
        {
          code,
          inviteStatus: EnumGroupInviteStatus.Pending,
          inviteeUser: {
            id: reqAuthUser.id,
          },
        },
        {
          code,
          inviteStatus: EnumGroupInviteStatus.Pending,
          tempEmail: reqAuthUser.email,
        },
      ],
      relations: ['group'],
      select: {
        group: {
          id: true,
        },
      },
    });

    if (!groupInviteMemberLink) {
      throw new BadRequestException({
        statusCode: EnumGroupStatusCodeError.GroupUnprocessableInviteError,
        message: 'group.error.unprocessable',
      });
    }

    const groupId = groupInviteMemberLink.group.id;

    const findGroupMember = await this.groupMemberService.findOne({
      where: {
        group: {
          id: groupId,
        },
        user: {
          id: reqAuthUser.id,
        },
      },
    });

    if (findGroupMember) {
      throw new BadRequestException({
        statusCode: EnumGroupStatusCodeError.GroupUnprocessableInviteError, // Add new type
        message: 'group.error.alreadyMember',
      });
    }

    const result = await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        if (type == EnumAddGroupMemberType.PersonalInvite) {
          const now = this.helperDateService.create();
          const expiresAt = this.helperDateService.create({
            date: groupInviteMemberLink.expiresAt,
          });

          if (expiresAt && now > expiresAt) {
            throw new BadRequestException({
              statusCode: EnumGroupStatusCodeError.GroupInviteExpiredError,
              message: 'group.error.inviteExpired',
            });
          }
          const createGroupMember = await this.groupMemberService.create({
            role: EnumGroupRole.Basic,
            user: {
              id: reqAuthUser.id,
            },
            group: {
              id: groupId,
            },
          });

          // const saveGroupMember = await transactionalEntityManager.save(
          //   createGroupMember,
          // );

          await transactionalEntityManager.update(
            GroupInviteMember,
            { code },
            {
              inviteStatus: EnumGroupInviteStatus.Accept,
              ...(!groupInviteMemberLink?.inviteeUser?.id && {
                inviteeUser: reqAuthUser,
              }),
            },
          );

          return transactionalEntityManager.save(createGroupMember);
        } else {
          const groupInviteLink = await this.groupInviteLinkService.findOne({
            where: { group: { id: groupId } },
          });
          if (groupInviteLink.code !== code) {
            throw new BadRequestException({
              statusCode: EnumGroupStatusCodeError.GroupInviteNotFoundError,
              message: 'group.error.groupCode',
            });
          }

          const createGroupMember = await this.groupMemberService.create({
            role: EnumGroupRole.Basic,
            user: {
              id: reqAuthUser.id,
            },
            group: {
              id: groupId,
            },
          });
          return this.groupMemberService.save(createGroupMember);
        }
      },
    );

    return { dev: result };
  }

  @ClientResponse('group.inviteReject')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Post('/invite-reject/:id')
  async inviteReject(
    @ReqAuthUser()
    reqAuthUser: User,
    @Param('id') inviteId: string,
  ): Promise<IResponseData> {
    const invite = await this.groupInviteMemberService.findOne({
      where: {
        id: inviteId,
        inviteStatus: EnumGroupInviteStatus.Pending,
      },
    });

    if (!invite) {
      throw new BadRequestException({
        statusCode: EnumGroupStatusCodeError.GroupUnprocessableInviteError,
        message: 'group.error.unprocessable',
      });
    }

    await this.groupInviteMemberService.updateInviteStatus({
      inviteId,
      inviteStatus: EnumGroupInviteStatus.Reject,
    });

    return { inviteStatus: EnumGroupInviteStatus.Reject };
  }

  @ClientResponse('group.inviteCancel')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Post('/invite-cancel/:id')
  async inviteCancel(
    @ReqAuthUser()
    reqAuthUser: User,
    @Param('id') inviteId: string,
  ): Promise<IResponseData> {
    const invite = await this.groupInviteMemberService.findOne({
      where: {
        inviterUser: {
          id: reqAuthUser.id,
        },
        id: inviteId,
        inviteStatus: EnumGroupInviteStatus.Pending,
      },
    });

    if (!invite) {
      throw new BadRequestException({
        statusCode: EnumGroupStatusCodeError.GroupUnprocessableInviteError,
        message: 'group.error.unprocessable',
      });
    }

    await this.groupInviteMemberService.updateInviteStatus({
      inviteId,
      inviteStatus: EnumGroupInviteStatus.Cancel,
    });

    return { inviteStatus: EnumGroupInviteStatus.Cancel };
  }

  @ClientResponse('group.inviteResend')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Post('/invite-resend/:id')
  async inviteResend(
    @ReqAuthUser()
    reqAuthUser: User,
    @Param('id') inviteId: string,
  ): Promise<IResponseData> {
    const invite = await this.groupInviteMemberService.findOne({
      where: {
        id: inviteId,
        inviterUser: {
          id: reqAuthUser.id,
        },
        inviteStatus: EnumGroupInviteStatus.Pending,
      },
      relations: ['user', 'user.profile'],
      select: {
        tempEmail: true,
        inviteeUser: {
          email: true,
          profile: {
            firstName: true,
          },
        },
      },
    });

    if (!invite) {
      throw new BadRequestException({
        statusCode: EnumGroupStatusCodeError.GroupUnprocessableInviteError,
        message: 'group.error.invite.unprocessable',
      });
    }

    const result = await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const expiresInDays = this.configService.get<number>(
          'group.groupInviteCodeExpiresInDays',
        );

        const invitedUser = invite.inviteeUser;

        const emailSent = invitedUser
          ? await this.emailService.sendGroupInviteEmailExistingUser({
              email: invitedUser.email,
              code: invite.code,
              expiresInDays,
              firstName: invitedUser.profile.firstName,
            })
          : await this.emailService.sendGroupInviteEmailNewUser({
              email: invite.tempEmail,
              code: invite.code,
              expiresInDays,
            });

        if (!emailSent) {
          throw new InternalServerErrorException({
            statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
            message: 'messaging.error.email.send',
          });
        }

        const updatedInvite = await transactionalEntityManager.update(
          GroupInviteMember,
          { id: inviteId },
          { expiresAt: this.helperDateService.forwardInDays(expiresInDays) },
        );

        return updatedInvite;
      },
    );

    return result;
  }

  @ClientResponse('group.inviteMember')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @RequestParamGuard(IdParamDto)
  @Post('/:id/invite-member')
  async inviteMember(
    @ReqAuthUser()
    { id: userId }: User,
    @Body()
    { invitees }: GroupInviteMemberDto,
    @Param('id') groupId: string,
  ): Promise<IResponseData> {
    const findGroup = await this.groupService.findGroup({
      isOwner: false,
      userId,
      groupId,
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
                select: {
                  id: true,
                },
              });

              if (existingMember) {
                return Promise.resolve(existingMember);
              }
            }

            const existingInvite = await this.groupInviteMemberService.findOne({
              where: {
                inviteStatus: EnumGroupInviteStatus.Pending,
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
                },
                tempEmail: true,
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
              inviteeUser: {
                id: potentialMemberUser ? potentialMemberUser.id : null,
              },
              tempEmail: !potentialMemberUser ? invitee.email : null,
              group: {
                id: groupId,
              },
              inviterUser: {
                id: userId,
              },
              role: EnumGroupRole.Basic,
              code: await this.helperHashService.magicCode(),
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
              curr instanceof GroupInviteMember ||
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

        const nonExistingUsersRes = await Promise.allSettled(
          nonExistingUserInvitesData.map(async (inviteData) => {
            const createInvite = await this.groupInviteMemberService.create(
              inviteData,
            );

            const saveInvite = await transactionalEntityManager.save(
              createInvite,
            );

            const emailSent =
              await this.emailService.sendGroupInviteEmailNewUser({
                email: saveInvite.tempEmail,
                code: saveInvite.code,
                expiresInDays,
              });

            return Promise.reject(saveInvite);
            if (!emailSent) {
              return Promise.reject(saveInvite);
            }
            return Promise.resolve(saveInvite);
          }),
        );

        const existingUsersRes = await Promise.allSettled(
          existingUsersInvitesDat.map(async (inviteData) => {
            const createInvite = await this.groupInviteMemberService.create(
              inviteData,
            );

            const saveInvite = await transactionalEntityManager.save(
              createInvite,
            );

            const findInviteeUser = await this.userService.findOne({
              where: {
                id: saveInvite.inviteeUser.id,
              },
              relations: {
                profile: true,
              },
              select: {
                id: true,
                profile: {
                  id: true,
                  firstName: true,
                },
              },
            });

            const emailSent =
              await this.emailService.sendGroupInviteEmailExistingUser({
                email: saveInvite.inviteeUser.email,
                firstName: findInviteeUser.profile.firstName,
                code: saveInvite.code,
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
}
