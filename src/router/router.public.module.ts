import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { AwsModule } from '@/aws/aws.module';
import { UserModule } from '@/user/user.module';

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [UserModule, AwsModule, AuthModule],
})
export class RouterPublicModule {}
