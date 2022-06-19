import { Controller } from '@nestjs/common';
import { DebuggerService } from '@/debugger';
import { UserService } from '@/user';
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
