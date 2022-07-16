import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
// Services
import { DebuggerService } from '@/debugger/service';
import { HelperDateService } from '@/utils/helper/service';
import { AuthSignUpVerificationService } from '@/auth/service';
import { OrganizationInviteService } from '@/organization/service';
//
import { UserSignUpValidateDto } from '@/auth/dto/auth.signup-validate.dto';
import { EnumUserStatusCodeError } from '@/user';
import { ConnectionNames } from '@/database';
import { InjectDataSource } from '@nestjs/typeorm';
import { Response, IResponse } from '@/utils/response';
import { EnumOrganizationStatusCodeError } from '@/organization';
import { OrganizationInviteValidateDto } from '@/organization/dto';

//

@Controller({})
export class MagicLinkController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly debuggerService: DebuggerService,
    private readonly configService: ConfigService,
    private readonly authSignUpVerificationService: AuthSignUpVerificationService,
    private readonly helperDateService: HelperDateService,
    private readonly organizationInviteService: OrganizationInviteService,
  ) {}

  @Response('user.signUpSuccess')
  @Get('/signup')
  async signUpValidate(
    @Query()
    { signUpCode }: UserSignUpValidateDto,
  ): Promise<IResponse> {
    const existingSignUp = await this.authSignUpVerificationService.findOne({
      where: { signUpCode },
      relations: ['user', 'user.authConfig'],
      select: {
        user: {
          id: true,
          isActive: true,
          authConfig: {
            id: true,
            emailVerifiedAt: true,
          },
        },
      },
    });

    if (!existingSignUp) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.UserSignUpLinkNotFound,
        message: 'user.error.signUpCode',
      });
    }

    const now = this.helperDateService.create();
    const expiresAt = this.helperDateService.create({
      date: existingSignUp.expiresAt,
    });

    if (now > expiresAt || existingSignUp.usedAt) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.UserSignUpLinkExpired,
        message: 'user.error.signUpLink',
      });
    }

    await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        existingSignUp.usedAt = this.helperDateService.create();
        existingSignUp.user.isActive = true;
        existingSignUp.user.authConfig.emailVerifiedAt = existingSignUp.usedAt;

        await transactionalEntityManager.save(existingSignUp);
      },
    );

    return;
  }

  @Response('organization.inviteValid')
  @Get('/join')
  async joinValidate(
    @Query()
    { inviteCode }: OrganizationInviteValidateDto,
  ) {
    const existingInvite = await this.organizationInviteService.findOneBy({
      inviteCode,
    });

    if (!existingInvite) {
      throw new NotFoundException({
        statusCode:
          EnumOrganizationStatusCodeError.OrganizationInviteNotFoundError,
        message: 'organization.error.inviteInvalid',
      });
    }

    const now = this.helperDateService.create();
    const expiresAt = this.helperDateService.create({
      date: existingInvite.expiresAt,
    });

    if (now > expiresAt || existingInvite.usedAt) {
      throw new ForbiddenException({
        statusCode:
          EnumOrganizationStatusCodeError.OrganizationInviteExpiredError,
        message: 'organization.error.inviteInvalid',
      });
    }

    return;
  }
}
