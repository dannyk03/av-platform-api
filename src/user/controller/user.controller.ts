import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AclRoleService } from '@acl/role/service';

import { AclGuard } from '@/auth';
import { HelperDateService } from '@/utils/helper/service';
import { IResponse, Response } from '@/utils/response';

import { User } from '../entity';
import { UserService } from '../service';
import { ReqUser } from '../user.decorator';

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
  ): Promise<IResponse> {
    return this.userService.serializationUserProfile(reqUser);
  }
}
