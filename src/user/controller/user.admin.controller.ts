import { Controller } from '@nestjs/common';
import { AuthService } from '@/auth';
import { DebuggerService } from '@/debugger';
import { UserService } from '../service/user.service';

@Controller({
  version: '1',
  path: 'user',
})
export class UserAdminController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
}
