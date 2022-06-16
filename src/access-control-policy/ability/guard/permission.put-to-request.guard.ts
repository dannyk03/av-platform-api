import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AcpAbility } from '../entity/acp-ability.entity';
import { AcpAbilityService } from '../service/acp-ability.service';

@Injectable()
export class PermissionPutToRequestGuard implements CanActivate {
  constructor(private readonly permissionService: AcpAbilityService) {}

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
