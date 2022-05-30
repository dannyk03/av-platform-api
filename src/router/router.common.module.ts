import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '@/auth/auth.module';
import { AuthCommonController } from '@/auth/controller/auth.common.controller';
import { PermissionModule } from '@/permission/permission.module';
import { RoleModule } from '@/role/role.module';
import { SettingCommonController } from '@/setting/controller/setting.common.controller';
import { UserModule } from '@/user/user.module';

@Module({
    controllers: [AuthCommonController, SettingCommonController],
    providers: [],
    exports: [],
    imports: [
        UserModule,
        AuthModule,
        RoleModule,
        PermissionModule,
        TerminusModule,
        HttpModule,
    ],
})
export class RouterCommonModule {}
