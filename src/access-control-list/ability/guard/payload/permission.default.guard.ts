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
    // const { user } = context.switchToHttp().getRequest();
    // const { role } = user;
    // const permissions: string[] = role.permissions
    //   .filter((val: IPermission) => val.isActive)
    //   .map((val: IPermission) => val.code);
    // const hasPermission: boolean = requiredPermission.every((permission) =>
    //   permissions.includes(permission),
    // );
    // if (!hasPermission) {
    //   this.debuggerService.error(
    //     'Permission not has permission',
    //     'PermissionDefaultGuard',
    //     'canActivate',
    //   );
    //   throw new ForbiddenException({
    //     statusCode: PermissionsStatusCodeError.GuardInvalidError,
    //     message: 'permission.error.forbidden',
    //   });
    // }
    // return hasPermission;
    return true;
  }
}
