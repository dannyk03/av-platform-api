import { Module } from '@nestjs/common';
import { OrganizationModule, OrganizationController } from '@/organization';
import { PermissionModule } from '@/permission';
import { UserModule } from '@/user';

@Module({
    controllers: [OrganizationController],
    providers: [],
    exports: [],
    imports: [OrganizationModule, PermissionModule, UserModule],
})
export class RouterOrganizationModule {}
