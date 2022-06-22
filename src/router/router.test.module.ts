import { Module } from '@nestjs/common';
import { TestingCommonController } from '@/testing';

@Module({
  controllers: [TestingCommonController],
  providers: [],
  exports: [],
  imports: [],
})
export class RouterTestModule {}
