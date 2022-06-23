import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AclAbility } from '../entity/acl-ability.entity';
import { AclAbilityService } from '../service/acl-ability.service';

@Injectable()
export class PermissionPutToRequestGuard implements CanActivate {
  constructor(private readonly permissionService: AclAbilityService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;
    const { permission } = params;

    // const check: PermissionDocument = await this.permissionService.findOneById(
    //   permission,
    // );
    // request.__permission = check;

    return true;
  }
}
