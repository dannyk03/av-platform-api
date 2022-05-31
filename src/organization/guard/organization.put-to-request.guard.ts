import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IOrganizationDocument } from '../organization.interface';
import { OrganizationService } from '../service/organization.service';

@Injectable()
export class OrganizationPutToRequestGuard implements CanActivate {
    constructor(private readonly organizationService: OrganizationService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { slug } = params;

        const check: IOrganizationDocument =
            await this.organizationService.findOne<IOrganizationDocument>({
                slug,
            });
        request.__organization = check;

        return true;
    }
}
