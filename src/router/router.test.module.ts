import { Module } from '@nestjs/common';

import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { UserModule } from '@/user/user.module';

import { TestingCommonController } from '@/testing';

@Module({
  controllers: [TestingCommonController],
  providers: [],
  exports: [],
  imports: [UserModule, CloudinaryModule],
})
export class RouterTestModule {}
