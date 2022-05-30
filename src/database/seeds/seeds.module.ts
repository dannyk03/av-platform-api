import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { PermissionModule } from '@/permission/permission.module';
import { PermissionSeed } from '@/database/seeds/permission.seed';
import { RoleSeed } from './role.seed';
import { RoleModule } from '@/role/role.module';
import { UserSeed } from './user.seed';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { CoreModule } from '@/core/core.module';
import { AuthApiSeed } from './auth.api.seed';
import { SettingSeed } from './setting.seed';

@Module({
    imports: [
        CoreModule,
        CommandModule,
        PermissionModule,
        AuthModule,
        UserModule,
        RoleModule,
    ],
    providers: [AuthApiSeed, PermissionSeed, RoleSeed, UserSeed, SettingSeed],
    exports: [],
})
export class SeedsModule {}
