import { TestingCommonController } from '$/testing';
import { Module } from '@nestjs/common';
// Module
import { CloudinaryModule } from '$/cloudinary/cloudinary.module';
import { UserModule } from '$/user/user.module';
//

@Module({
  controllers: [TestingCommonController],
  providers: [],
  exports: [],
  imports: [UserModule, CloudinaryModule],
})
export class RouterTestModule {}
