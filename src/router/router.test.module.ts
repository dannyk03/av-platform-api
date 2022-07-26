import { Module } from '@nestjs/common';

import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { TestingCommonController } from '@/testing';
import { UserModule } from '@/user/user.module';

@Module({
  controllers: [TestingCommonController],
  providers: [],
  exports: [],
  imports: [UserModule, CloudinaryModule],
})
export class RouterTestModule {}
