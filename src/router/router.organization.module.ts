import { Module } from '@nestjs/common';
import { OrganizationModule, OrganizationController } from '@/organization';
import { PermissionModule } from '@/permission';

@Module({
    controllers: [OrganizationController],
    providers: [],
    exports: [],
    imports: [OrganizationModule, PermissionModule],
})
export class RouterOrganizationModule {}
