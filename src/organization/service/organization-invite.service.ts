import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import {
  EnumMessagingStatusCodeError,
  EnumOrganizationStatusCodeError,
  EnumRoleStatusCodeError,
  IResponseData,
} from '@avo/type';

import {
  DeepPartial,
  EntityManager,
  FindOneOptions,
  FindOptionsWhere,
  IsNull,
  Repository,
} from 'typeorm';

import { OrganizationInviteLink } from '../entity';
import { User } from '@/user/entity';
import { AclRole } from '@acl/role/entity';

import { EmailService } from '@/messaging/email/service';
import { UserService } from '@/user/service';
import { HelperDateService, HelperHashService } from '@/utils/helper/service';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class OrganizationInviteService {
  constructor(
    @InjectRepository(OrganizationInviteLink, ConnectionNames.Default)
    private organizationInviteRepository: Repository<OrganizationInviteLink>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly helperDateService: HelperDateService,
    private readonly helperHashService: HelperHashService,
    private readonly userService: UserService,
  ) {}

  async create(
    props: DeepPartial<Omit<OrganizationInviteLink, 'code'>>,
  ): Promise<OrganizationInviteLink> {
    return this.organizationInviteRepository.create({
      ...props,
      code: await this.helperHashService.magicCode(),
    });
  }

  async save(props: OrganizationInviteLink): Promise<OrganizationInviteLink> {
    return this.organizationInviteRepository.save(props);
  }

  async findOne(
    find: FindOneOptions<OrganizationInviteLink>,
  ): Promise<OrganizationInviteLink> {
    return this.organizationInviteRepository.findOne(find);
  }

  async findOneBy(
    find: FindOptionsWhere<OrganizationInviteLink>,
  ): Promise<OrganizationInviteLink> {
    return this.organizationInviteRepository.findOneBy(find);
  }

  async invite({
    email,
    aclRole,
    fromUser,
    transactionalEntityManager,
  }: {
    email: string;
    aclRole: AclRole;
    fromUser: User;
    transactionalEntityManager?: EntityManager;
  }): Promise<IResponseData> {
    const expiresInDays = this.configService.get<number>(
      'organization.inviteCodeExpiresInDays',
    );

    if (aclRole && !aclRole?.isActive) {
      throw new ForbiddenException({
        statusCode: EnumRoleStatusCodeError.RoleNotFoundError,
        message: 'role.error.inactive',
      });
    }

    if (aclRole && !aclRole?.organization?.isActive) {
      throw new ForbiddenException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationInactiveError,
        message: 'organization.error.inactive',
      });
    }

    const inviteeUser = await this.userService.findOne({
      where: {
        email,
      },
      relations: ['role', 'organization'],
      select: {
        id: true,
        role: { id: true },
        organization: { id: true },
      },
    });

    if (aclRole && inviteeUser?.role?.id === aclRole.id) {
      throw new UnprocessableEntityException({
        statusCode:
          EnumOrganizationStatusCodeError.OrganizationInviteUnprocessableError,
        message: 'organization.error.alreadyRole',
        properties: { roleName: aclRole.name },
      });
    }

    if (inviteeUser?.organization?.id === aclRole.organization.id) {
      inviteeUser.role = aclRole;

      transactionalEntityManager
        ? await transactionalEntityManager.save(inviteeUser)
        : await this.userService.save(inviteeUser);

      return {
        meta: {
          message: 'organization.changeRoleTo',
          properties: { roleName: aclRole.name },
        },
      };
    }

    const alreadyExistingOrganizationInvite =
      await this.organizationInviteRepository.findOne({
        where: {
          email,
          usedAt: IsNull(),
          role: {
            id: aclRole?.id,
          },
        },
        relations: ['organization'],
        select: {
          organization: {
            id: true,
            name: true,
          },
        },
      });

    if (
      aclRole &&
      alreadyExistingOrganizationInvite?.organization.id ===
        aclRole.organization?.id
    ) {
      alreadyExistingOrganizationInvite.role = aclRole;

      transactionalEntityManager
        ? await transactionalEntityManager.save(
            alreadyExistingOrganizationInvite,
          )
        : await this.save(alreadyExistingOrganizationInvite);
    }

    if (!alreadyExistingOrganizationInvite) {
      const organizationInvite = await this.create({
        email,
        role: aclRole,
        organization: aclRole.organization,
        fromUser,
        user: inviteeUser,
        // Set expired field after email send succeeded
      });

      // If transactional, use transaction
      transactionalEntityManager
        ? await transactionalEntityManager.save(organizationInvite)
        : await this.save(organizationInvite);

      const emailSent = await this.emailService.sendOrganizationInvite({
        email,
        expiresInDays,
        code: organizationInvite.code,
        organizationName: organizationInvite.organization.name,
      });

      if (emailSent) {
        organizationInvite.expiresAt =
          this.helperDateService.forwardInDays(expiresInDays);

        // If transactional, use transaction
        transactionalEntityManager
          ? await transactionalEntityManager.save(organizationInvite)
          : await this.save(organizationInvite);

        return { code: organizationInvite.code };
      } else {
        throw new InternalServerErrorException({
          statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
          message: 'messaging.email.error.send',
        });
      }
    } else {
      const now = this.helperDateService.create();
      const inviteExpires =
        alreadyExistingOrganizationInvite.expiresAt &&
        this.helperDateService.create({
          date: alreadyExistingOrganizationInvite.expiresAt,
        });

      // Resend invite if expired
      const isResend =
        (!inviteExpires || now > inviteExpires) &&
        !alreadyExistingOrganizationInvite.usedAt;
      if (isResend) {
        const emailSent = await this.emailService.sendOrganizationInvite({
          email,
          expiresInDays,
          code: alreadyExistingOrganizationInvite.code,
          organizationName: alreadyExistingOrganizationInvite.organization.name,
        });
        if (emailSent) {
          alreadyExistingOrganizationInvite.expiresAt =
            this.helperDateService.forwardInDays(expiresInDays);

          // If transactional use transaction
          transactionalEntityManager
            ? await transactionalEntityManager.save(
                alreadyExistingOrganizationInvite,
              )
            : await this.save(alreadyExistingOrganizationInvite);

          return { code: alreadyExistingOrganizationInvite.code };
        } else {
          throw new InternalServerErrorException({
            statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
            message: 'messaging.email.error.resend',
          });
        }
      } else {
        return {
          meta: {
            statusCode:
              EnumOrganizationStatusCodeError.OrganizationUserAlreadyInvited,
            message: 'organization.error.alreadyInvited',
          },
          ...(!alreadyExistingOrganizationInvite.usedAt && {
            code: alreadyExistingOrganizationInvite.code,
          }),
        };
      }
    }
  }
}
