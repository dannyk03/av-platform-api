import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  EntityManager,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
// Services
import { EmailService } from '$/messaging/email';
import { HelperDateService, HelperHashService } from '$/utils/helper/service';
// Entities
import { AclRole } from '$acl/role/entity';
import { OrganizationInviteLink } from '../entity';
//
import { EnumRoleStatusCodeError } from '$/access-control-list/role';
import { ConnectionNames } from '$/database';
import { EnumMessagingStatusCodeError } from '$/messaging/messaging.constant';
import { SuccessException } from '$/utils/error';
import { EnumOrganizationStatusCodeError } from '../organization.constant';

@Injectable()
export class OrganizationInviteService {
  constructor(
    @InjectRepository(OrganizationInviteLink, ConnectionNames.Default)
    private organizationInviteRepository: Repository<OrganizationInviteLink>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly helperDateService: HelperDateService,
    private readonly helperHashService: HelperHashService,
  ) {}

  async create(
    props: DeepPartial<Omit<OrganizationInviteLink, 'code'>>,
  ): Promise<OrganizationInviteLink> {
    return this.organizationInviteRepository.create({
      ...props,
      code: this.helperHashService.code32char(),
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
      throw new ForbiddenException({
        statusCode: EnumRoleStatusCodeError.RoleNotFoundError,
        message: 'role.error.notFound',
      });
    }

    if (!aclRole.organization.isActive) {
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
        throw new SuccessException({
          statusCode:
            EnumOrganizationStatusCodeError.OrganizationUserAlreadyInvited,
          message: 'organization.error.alreadyInvited',

          ...(!alreadyExistingOrganizationInvite.usedAt && {
            data: {
              code: alreadyExistingOrganizationInvite.code,
            },
          }),
        });
      }
    }
  }
}
