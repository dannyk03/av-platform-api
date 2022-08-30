import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { IResponseData } from '@avo/type';

import { User } from '../entity';

import { ReqUser } from '../decorator/user.decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';

import { UserProfileGetSerialization } from '../serialization';

@Controller({
  version: '1',
})
export class UserCommonController {
  @ClientResponse('user.profile', {
    classSerialization: UserProfileGetSerialization,
  })
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    relations: ['profile'],
  })
  @Get('/profile')
  async getProfile(
    @ReqUser()
    reqUser: User,
  ): Promise<IResponseData> {
    return reqUser;
  }
}
