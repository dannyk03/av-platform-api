import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Action, Subject } from '@avo/casl';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
import { HelperDateService } from '@/utils/helper/service';
import { AclGuard } from '@/auth';
import { IReqLogData } from '@/log';
import { OrganizationCreateDto } from '@/organization/dto';
import { ReqUser } from '@/user';
// Entities
import { User } from '@/user/entity';
//
import { ReqLogData } from '@/utils/request';
import { Response, IResponse } from '@/utils/response';

@Controller({
  version: '1',
  path: 'product',
})
export class ProductController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
  ) {}

  @Response('product.create')
  @HttpCode(HttpStatus.OK)
  @AclGuard(
    [
      {
        action: Action.Create,
        subject: Subject.Product,
      },
    ],
    { systemOnly: true },
  )
  @Post('/create')
  async create(
    @Body()
    {
      name: organizationName,
      email: organizationOwnerEmail,
      password: initialOwnerPassword,
    }: OrganizationCreateDto,
  ): Promise<IResponse> {
    return;
  }
}
