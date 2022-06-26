import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
// Services
import { UserService } from '../service/user.service';
import { DebuggerService } from '@/debugger/service/debugger.service';
//
import { EnumUserStatusCodeError } from '../user.constant';

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly debuggerService: DebuggerService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;

    const requestUser = await this.userService.findOneById(user.id, {
      relations: [
        'organization',
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
      },
    });

    if (!requestUser) {
      this.debuggerService.error(
        'User not found',
        'UserNotFoundGuard',
        'canActivate',
      );

      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.UserNotFoundError,
        message: 'user.error.notFound',
      });
    }

    request.__user = requestUser;

    return true;
  }
}
