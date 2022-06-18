import { Controller } from '@nestjs/common';
import { DebuggerService } from 'src/debugger/service/debugger.service';
import { UserService } from 'src/user/service/user.service';
import { AuthService } from '../service/auth.service';

@Controller({
  version: '1',
  path: '/auth',
})
export class AuthPublicController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
}
