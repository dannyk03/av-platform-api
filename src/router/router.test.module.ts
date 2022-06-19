import { Module } from '@nestjs/common';
import { TestingCommonController } from '@/testing';
import { UserModule } from '@/user';
import { AuthModule } from '@/auth';

@Module({
  controllers: [TestingCommonController],
  providers: [],
  exports: [],
  imports: [AuthModule, UserModule],
})
export class RouterTestModule {}
