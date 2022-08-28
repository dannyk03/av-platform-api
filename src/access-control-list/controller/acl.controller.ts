import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { IResponseData } from '@avo/type';

import { User } from '@/user/entity';

import { AclPolicyService } from '../policy/service';

import { ReqUser } from '@/user/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';

import { AclPolicySerialization } from '../policy/serialization';

@Controller({
  version: '1',
  path: 'acl',
})
export class AclController {
  constructor(private readonly aclPolicyService: AclPolicyService) {}

  @ClientResponse('acl.abilities', {
    classSerialization: AclPolicySerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Get()
  async create(
    @ReqUser()
    reqUser: User,
  ): Promise<IResponseData> {
    return reqUser?.role?.policy;
  }
}
