import { Controller } from '@nestjs/common';

import { UserService } from '../service/user.service';

import { PaginationService } from 'src/utils/pagination/service/pagination.service';
import { AuthService } from 'src/auth/service/auth.service';

import { DebuggerService } from 'src/debugger/service/debugger.service';

@Controller({
  version: '1',
  path: 'user',
})
export class UserAdminController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly authService: AuthService,
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
  ) {}
}
