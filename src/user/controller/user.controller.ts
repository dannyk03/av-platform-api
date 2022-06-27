import { Controller } from '@nestjs/common';
// Services
import { AuthService } from '@/auth/service/auth.service';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { UserService } from '../service/user.service';
//

@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
}
