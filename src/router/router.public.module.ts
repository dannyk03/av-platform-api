import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { AuthPublicController } from '@/auth/controller/auth.public.controller';
import { AwsModule } from '@/aws/aws.module';
// import { PermissionModule } from '@/permission/permission.module';
// import { RoleModule } from '@/role/role.module';
import { UserPublicController } from '@/user/controller/user.public.controller';
import { UserModule } from '@/user/user.module';

@Module({
  controllers: [UserPublicController, AuthPublicController],
  providers: [],
  exports: [],
  imports: [
    UserModule,
    AwsModule,
    AuthModule,
    // RoleModule, PermissionModule
  ],
})
export class RouterPublicModule {}
