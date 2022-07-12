import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { defineAbilities } from '@avo/casl';
// Services
import { DebuggerService } from '@/debugger/service';
//
import {
  ABILITY_META_KEY,
  PermissionsStatusCodeError,
} from '../acl-ability.constant';
import { IReqAclAbility } from '@acl/acl.interface';

@Injectable()
export class AclAbilityGuard implements CanActivate {
  constructor(
    private readonly debuggerService: DebuggerService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const requiredAbilities = this.reflector.getAllAndOverride<
      IReqAclAbility[]
    >(ABILITY_META_KEY, [ctx.getHandler(), ctx.getClass()]);
    const { __user, originalUrl, method } = ctx.switchToHttp().getRequest();
    const { role } = __user;

    if (!requiredAbilities.length) {
      return true;
    } else if (!role) {
      throw new ForbiddenException({
        statusCode: PermissionsStatusCodeError.GuardInvalidError,
        message: 'permission.error.forbidden',
      });
    }

    const abilities = defineAbilities(role.policy.subjects)(__user);

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
