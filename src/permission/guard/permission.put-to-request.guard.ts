import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PermissionEntity } from '../entity/permission.entity';
import { PermissionService } from '../service/permission.service';

@Injectable()
export class PermissionPutToRequestGuard implements CanActivate {
  constructor(private readonly permissionService: PermissionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;
    const { permission } = params;

    const check: PermissionEntity = await this.permissionService.findOneById(
      permission,
    );
    request.__permission = check;

    return true;
  }
}
