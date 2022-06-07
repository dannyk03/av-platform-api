import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { IResult } from 'ua-parser-js';
import { ApiKey, AuthExcludeApiKey } from '@/auth/auth.decorator';
import { IAuthApiPayload } from '@/auth/auth.interface';
import { UserAgent } from '@/utils/request/request.decorator';
import { Response } from '@/utils/response/response.decorator';
import { IResponse } from '@/utils/response/response.interface';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { ENUM_PERMISSIONS } from '@/permission/permission.constant';
import { PermissionBulkService } from '@/permission/service/permission.bulk.service';
import { PermissionService } from '@/permission/service/permission.service';
import { In } from 'typeorm';
import { PermissionEntity } from '@/permission/entity/permission.entity';

@Controller({
  version: VERSION_NEUTRAL,
})
export class TestingCommonController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly permissionBulkService: PermissionBulkService,
    private readonly permissionService: PermissionService,
  ) {}

  @Response('test.hello')
  @AuthExcludeApiKey()
  @Get()
  async hello(
    @UserAgent() userAgent: IResult,
    @ApiKey() apiKey: IAuthApiPayload,
  ): Promise<IResponse> {
    return { userAgent, apiKey };
  }
}
