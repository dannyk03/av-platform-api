import { AuthModule } from '@/auth/auth.module';
import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { CoreModule } from 'src/core/core.module';
import { SuperSeed } from './super.seed';

@Module({
  imports: [
    CoreModule,
    CommandModule,
    AuthModule,
    // PermissionModule,
    // RoleModule,
    // UserModule,
  ],
  providers: [
    // PermissionSeed,
    // RoleSeed,
    // AuthApiSeed,
    //
    SuperSeed,
  ],
  exports: [],
})
export class SeedsModule {}
