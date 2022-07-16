import { Module } from '@nestjs/common';
import { TestingCommonController } from '@/testing';
// Module
import { UserModule } from '@/user/user.module';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
//

@Module({
  controllers: [TestingCommonController],
  providers: [],
  exports: [],
  imports: [UserModule, CloudinaryModule],
})
export class RouterTestModule {}
