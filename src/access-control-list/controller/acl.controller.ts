import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { AclGuard } from '@/auth';
import { ReqUser } from '@/user';
import { User } from '@/user/entity';
import { IResponse, Response } from '@/utils/response';

import { AclPolicyService } from '../policy/service';

@Controller({
  version: '1',
  path: 'acl',
})
export class AclController {
  constructor(private readonly aclPolicyService: AclPolicyService) {}

  @Response('acl.abilities')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get()
  async create(
    @ReqUser()
    reqUser: User,
  ): Promise<IResponse> {
    return (
      reqUser.role &&
      this.aclPolicyService.serializationUserAcl(reqUser.role.policy)
    );
  }
}
