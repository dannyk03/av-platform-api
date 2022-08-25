import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { IResponseData } from '@avo/type';

import { User } from '@/user/entity';

import { AclPolicyService } from '../policy/service';

import { AclPolicySerialization } from '../policy/serialization';

import { AclGuard } from '@/auth';
import { ReqUser } from '@/user';
import { Response } from '@/utils/response';

@Controller({
  version: '1',
  path: 'acl',
})
export class AclController {
  constructor(private readonly aclPolicyService: AclPolicyService) {}

  @Response('acl.abilities', { classSerialization: AclPolicySerialization })
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
