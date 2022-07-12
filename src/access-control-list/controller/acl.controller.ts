import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
import { LogService } from '@/log/service/log.service';
// Entities
import { User } from '@/user/entity/user.entity';
// Services
import { AclPolicyService } from '../policy/service/acl-policy.service';
//
import { AclGuard } from '@/auth';
import { ReqUser } from '@/user/user.decorator';
import { Response, IResponse } from '@/utils/response';
import { EnumStatusCodeError } from '@/utils/error';
import { EnumLoggerAction, IReqLogData } from '@/log';
import { ReqLogData } from '@/utils/request';

@Controller({
  version: '1',
  path: 'acl',
})
export class AclController {
  constructor(
    private readonly aclPolicyService: AclPolicyService,
    private readonly debuggerService: DebuggerService,
    private readonly logService: LogService,
  ) {}

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
