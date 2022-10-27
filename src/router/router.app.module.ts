import { Module } from '@nestjs/common';

import { AppCommonController } from '@/app/app.common.controller';

@Module({
  controllers: [AppCommonController],
  providers: [],
  exports: [],
  imports: [],
})
export class RouterAppModule {}
