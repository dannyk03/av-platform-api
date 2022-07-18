import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// Services
import { UserService } from '../service';
import { DebuggerService } from '@/debugger/service';
//

@Injectable()
export class SenderPutToRequestGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly debuggerService: DebuggerService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;

    const requestUser = await this.userService.findOne({
      where: {
        email: user.email,
      },
      relations: [
        'organization',
        'authConfig',
        'role',
        'role.policy',
        'role.policy.subjects',
        'role.policy.subjects.abilities',
      ],
      select: {
        organization: {
          isActive: true,
          id: true,
          name: true,
          slug: true,
        },
        authConfig: {
          password: true,
          passwordExpiredAt: true,
        },
      },
    });

    request.__user = requestUser;

    return true;
  }
}
