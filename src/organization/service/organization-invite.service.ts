import { ConfigService } from '@nestjs/config';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
  EntityManager,
  FindOneOptions,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
// Services
import { EmailService } from '@/messaging/service/email/email.service';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { HelperDateService } from '@/utils/helper/service/helper.date.service';
// Entities
import { OrganizationInvite } from '../entity/organization-invite.entity';
import { AclRole } from '@acl/role/entity';
import { EnumRoleStatusCodeError } from '@/access-control-list/role';
import { EnumMessagingStatusCodeError } from '@/messaging/messaging.constant';
import { SuccessException } from '@/utils/error';
import { EnumOrganizationStatusCodeError } from '../organization.constant';
//
import { ConnectionNames } from '@/database';

@Injectable()
export class OrganizationInviteService {
  constructor(
    @InjectRepository(OrganizationInvite, ConnectionNames.Default)
    private organizationInviteRepository: Repository<OrganizationInvite>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly debuggerService: DebuggerService,
    private readonly helperDateService: HelperDateService,
  ) {}

  async create(
    props: DeepPartial<Omit<OrganizationInvite, 'inviteCode'>>,
  ): Promise<OrganizationInvite> {
    return this.organizationInviteRepository.create({
      ...props,
      inviteCode: uuidV4().replaceAll('-', ''),
    });
  }

  async save(props: OrganizationInvite): Promise<OrganizationInvite> {
    return this.organizationInviteRepository.save(props);
  }

  async findOne(
    find: FindOneOptions<OrganizationInvite>,
  ): Promise<OrganizationInvite> {
    return this.organizationInviteRepository.findOne(find);
  }

  async findOneBy(
    find: FindOptionsWhere<OrganizationInvite>,
  ): Promise<OrganizationInvite> {
    return this.organizationInviteRepository.findOneBy(find);
  }

  async invite({
    email,
    aclRole,
    transactionalEntityManager,
  }: {
    email: string;
    aclRole: AclRole;
    transactionalEntityManager?: EntityManager;
  }) {
    const expiresInDays = this.configService.get<number>(
      'organization.inviteCodeExpiresInDays',
    );

    if (!aclRole?.isActive) {
      this.debuggerService.error(
        'Organization role inactive error',
        'OrganizationInviteController',
        'invite',
      );

      throw new ForbiddenException({
        statusCode: EnumRoleStatusCodeError.RoleNotFoundError,
        message: 'role.error.notFound',
      });
    }

    if (!aclRole.organization.isActive) {
      this.debuggerService.error(
        'Organization inactive error',
        'OrganizationInviteController',
        'invite',
      );

      throw new ForbiddenException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationInactiveError,
        message: 'organization.error.inactive',
      });
    }

    const alreadyExistingOrganizationInvite = await this.findOne({
      where: { email },
      relations: ['organization'],
      select: {
        organization: {
          name: true,
        },
      },
    });

    if (!alreadyExistingOrganizationInvite) {
      const organizationInvite = await this.create({
        email,
        role: aclRole,
        organization: aclRole.organization,
        // Set expired field after email send succeeded
      });

      // If transactional, use transaction
      transactionalEntityManager
        ? await transactionalEntityManager.save(organizationInvite)
        : await this.save(organizationInvite);

      const emailSent = await this.emailService.sendOrganizationInvite({
        email,
        expiresInDays,
        inviteCode: organizationInvite.inviteCode,
        organizationName: organizationInvite.organization.name,
      });

      if (emailSent) {
        organizationInvite.expiresAt =
          this.helperDateService.forwardInDays(expiresInDays);

        // If transactional, use transaction
        transactionalEntityManager
          ? await transactionalEntityManager.save(organizationInvite)
          : await this.save(organizationInvite);

        return { inviteCode: organizationInvite.inviteCode };
      } else {
        this.debuggerService.error(
          'Messaging Email error',
          'OrganizationInviteController',
          'invite',
        );

        throw new InternalServerErrorException({
          statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
          message: 'messaging.email.error.send',
        });
      }
    } else {
      const now = this.helperDateService.create();
      const inviteExpires =
        alreadyExistingOrganizationInvite.expiresAt &&
        this.helperDateService.create(
          alreadyExistingOrganizationInvite.expiresAt,
        );

      // Resend invite if expired
      const isResend =
        (!inviteExpires || now > inviteExpires) &&
        !alreadyExistingOrganizationInvite.usedAt;
      if (isResend) {
        const emailSent = await this.emailService.sendOrganizationInvite({
          email,
          expiresInDays,
          inviteCode: alreadyExistingOrganizationInvite.inviteCode,
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

          return { inviteCode: alreadyExistingOrganizationInvite.inviteCode };
        } else {
          this.debuggerService.error(
            'Organization Invite Email error',
            'OrganizationInviteController',
            'invite',
          );

          throw new InternalServerErrorException({
            statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
            message: 'messaging.email.error.resend',
          });
        }
      } else {
        throw new SuccessException({
          statusCode:
            EnumOrganizationStatusCodeError.OrganizationUserAlreadyInvited,
          message: 'organization.error.alreadyInvited',

          ...(!alreadyExistingOrganizationInvite.usedAt && {
            data: {
              inviteCode: alreadyExistingOrganizationInvite.inviteCode,
            },
          }),
        });
      }
    }
  }
}
