import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
//
import {
  ABILITY_META_KEY,
  PermissionsStatusCodeError,
} from '../../acl-ability.constant';
import { IReqAclAbility } from '@acl/acl.interface';
import { defineAbilities } from '../../utils/define-ability-for-user.util';

@Injectable()
export class AclAbilityGuard implements CanActivate {
  constructor(
    private readonly debuggerService: DebuggerService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAbilities = this.reflector.getAllAndOverride<
      IReqAclAbility[]
    >(ABILITY_META_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredAbilities) {
      return true;
    }

    const { __user, originalUrl, method } = context.switchToHttp().getRequest();
    const { role } = __user;
    const {
      policy: { subjects },
    } = role;

    const abilities = defineAbilities(subjects)(__user);

    const hasPermission = requiredAbilities.every((ability) =>
      abilities.can(ability.action, ability.subject),
    );

    if (!hasPermission) {
      this.debuggerService.error(
        'No permissions',
        'AclAbilityGuard',
        'canActivate',
        {
          user: {
            id: __user.id,
          },
          http: {
            originalUrl,
            method,
          },
        },
      );
      throw new ForbiddenException({
        statusCode: PermissionsStatusCodeError.GuardInvalidError,
        message: 'permission.error.forbidden',
      });
    }
    return hasPermission;
  }
}
