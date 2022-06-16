import { Module } from '@nestjs/common';
import { TestingCommonController } from '@/testing/testing.common.controller';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
// import { PermissionModule } from '@/permission/permission.module';
// import { RoleModule } from '@/role/role.module';

@Module({
  controllers: [TestingCommonController],
  providers: [],
  exports: [],
  imports: [
    AuthModule,
    // RoleModule,
    UserModule,
    // PermissionModule
  ],
})
export class RouterTestModule {}
