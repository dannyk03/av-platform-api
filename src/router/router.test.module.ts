import { Module } from '@nestjs/common';
import { TestingCommonController } from '@/testing/testing.common.controller';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  controllers: [TestingCommonController],
  providers: [],
  exports: [],
  imports: [AuthModule, UserModule],
})
export class RouterTestModule {}
