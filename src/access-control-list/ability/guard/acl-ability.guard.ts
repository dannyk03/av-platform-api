import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { defineAbilities } from '@avo/casl';

import { IReqAclAbility } from '@/access-control-list/type/acl.interface';

import {
  ABILITY_META_KEY,
  PermissionsStatusCodeError,
} from '../acl-ability.constant';

@Injectable()
export class AclAbilityGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const requiredAbilities = this.reflector.getAllAndOverride<
      IReqAclAbility[]
    >(ABILITY_META_KEY, [ctx.getHandler(), ctx.getClass()]);
    const { __user } = ctx.switchToHttp().getRequest();
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
      throw new ForbiddenException({
        statusCode: PermissionsStatusCodeError.GuardInvalidError,
        message: 'permission.error.forbidden',
      });
    }
    return hasPermission;
  }
}
