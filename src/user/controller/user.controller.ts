import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IResponseData } from '@avo/type';

import { User } from '../entity';

import { UserService } from '../service';
import { HelperDateService } from '@/utils/helper/service';
import { AclRoleService } from '@acl/role/service';

import { ReqUser } from '../user.decorator';

import { AclGuard } from '@/auth';
import { Response } from '@/utils/response';

@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly roleService: AclRoleService,
    private readonly helperDateService: HelperDateService,
  ) {}

  @Response('user.profile')
  @AclGuard({
    relations: ['profile'],
  })
  @Get('/profile')
  async getProfile(
    @ReqUser()
    reqUser: User,
  ): Promise<IResponseData> {
    return this.userService.serializationUserProfile(reqUser);
  }
}
