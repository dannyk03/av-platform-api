import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { PermissionAdminController } from '@/permission/controller/permission.admin.controller';
import { PermissionModule } from '@/permission/permission.module';
import { RoleAdminController } from '@/role/controller/role.admin.controller';
import { RoleModule } from '@/role/role.module';
import { SettingAdminController } from '@/setting/controller/setting.admin.controller';
import { UserAdminController } from '@/user/controller/user.admin.controller';
import { UserModule } from '@/user/user.module';

@Module({
    controllers: [
        RoleAdminController,
        UserAdminController,
        PermissionAdminController,
        SettingAdminController,
    ],
    providers: [],
    exports: [],
    imports: [AuthModule, RoleModule, UserModule, PermissionModule],
})
export class RouterAdminModule {}
