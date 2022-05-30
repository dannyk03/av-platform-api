import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ITenantDocument } from '../tenant.interface';
import { TenantService } from '../service/tenant.service';

@Injectable()
export class TenantPutToRequestGuard implements CanActivate {
  constructor(private readonly tenantService: TenantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;
    const { slug } = params;

    const check: ITenantDocument =
      await this.tenantService.findOne<ITenantDocument>({ slug });
    request.__tenant = check;

    return true;
  }
}
