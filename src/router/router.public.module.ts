import { Module } from '@nestjs/common';

import { PublicModule } from '@/public/public.module';

import {
  PublicController,
  PublicValidationController,
} from '@/public/controller';

@Module({
  controllers: [PublicValidationController, PublicController],
  providers: [],
  exports: [],
  imports: [PublicModule],
})
export class RouterPublicModule {}
