import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../role.constant';
import { UserService } from 'src/user/service/user.service';
import { DebuggerService } from 'src/debugger/service/debugger.service';
import { User } from '@/user/entity/user.entity';

@Injectable()
export class RoleUsedGuard implements CanActivate {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { __role } = context.switchToHttp().getRequest();
    const check: User = await this.userService.findOne({
      role: __role.id,
    });

    if (check) {
      this.debuggerService.error('Role used', 'RoleUsedGuard', 'delete');
      throw new BadRequestException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_USED_ERROR,
        message: 'role.error.used',
      });
    }
    return true;
  }
}
