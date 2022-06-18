import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';

import { UserService } from 'src/user/service/user.service';
import { AuthService } from '../service/auth.service';
import { ENUM_AUTH_STATUS_CODE_SUCCESS } from '../auth.constant';
import { Response } from 'src/utils/response/response.decorator';
import { IResponse } from 'src/utils/response/response.interface';
import { ApiKey } from '../auth.decorator';
import { DebuggerService } from 'src/debugger/service/debugger.service';
import { LoggerService } from 'src/logger/service/logger.service';
import { HelperDateService } from 'src/utils/helper/service/helper.date.service';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { IAuthApiPayload } from '../auth.interface';

@Controller({
  version: '1',
  path: '/auth',
})
export class AuthCommonController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly helperDateService: HelperDateService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {}

  @Response('auth.login', ENUM_AUTH_STATUS_CODE_SUCCESS.AUTH_LOGIN_SUCCESS)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() body: AuthLoginDto,
    @ApiKey() apiKey: IAuthApiPayload,
  ): Promise<IResponse | any> {
    console.log('auth.login');
  }
}
