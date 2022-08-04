import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { Action, Subjects } from '@avo/casl';
import { EnumOrganizationStatusCodeError } from '@avo/type';

import { EnumOrganizationRole } from '@acl/role';
import { DataSource } from 'typeorm';

import { AuthService } from '@/auth/service';
import { UserService } from '@/user/service';
import { AclRolePresetService, AclRoleService } from '@acl/role/service';

import { OrganizationCreateDto } from '../../organization/dto/organization.create.dto';

import { AclGuard } from '@/auth';
import { ConnectionNames } from '@/database';
import { EnumLogAction, LogTrace } from '@/log';
import { Response } from '@/utils/response';

@Controller({
  version: '1',
  path: 'payment',
})
export class PaymentController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly userService: UserService,
    private readonly rolePresetService: AclRolePresetService,
    private readonly aclRoleService: AclRoleService,
    private readonly authService: AuthService,
  ) {}

  @Response('payment.pay')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.CreateOrganization, {
    tags: ['payment', 'pay'],
  })
  @AclGuard({
    abilities: [
      {
        action: Action.Create,
        subject: Subjects.Organization,
      },
      {
        action: Action.Create,
        subject: Subjects.User,
      },
    ],
    systemOnly: true,
  })
  @Post('/pay') // create
  async pay(
    @Body()
    {
      name: organizationName,
      email: organizationOwnerEmail,
      password: initialOwnerPassword,
    }: OrganizationCreateDto,
  ): Promise<void> {
    const a = 'b';

    return;
  }
}
