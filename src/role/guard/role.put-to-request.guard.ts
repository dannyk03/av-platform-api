import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IRoleEntity } from '../role.interface';
import { RoleService } from '../service/role.service';

@Injectable()
export class RolePutToRequestGuard implements CanActivate {
  constructor(private readonly roleService: RoleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;
    const { role } = params;

    const check: IRoleEntity = await this.roleService.findOneById<IRoleEntity>(
      role,
      {
        populate: {
          permission: true,
        },
      },
    );
    request.__role = check;

    return true;
  }
}
