import { Module } from '@nestjs/common';
import { TestingCommonController } from '@/testing';
// Module
import { UserModule } from '@/user/user.module';
//

@Module({
  controllers: [TestingCommonController],
  providers: [],
  exports: [],
  imports: [UserModule],
})
export class RouterTestModule {}
