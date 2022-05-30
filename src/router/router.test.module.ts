import { Module } from '@nestjs/common';
import { TestingCommonController } from '@/testing/testing.common.controller';

@Module({
    controllers: [TestingCommonController],
    providers: [],
    exports: [],
    imports: [],
})
export class RouterTestModule {}
