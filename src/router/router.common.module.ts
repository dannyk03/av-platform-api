import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController, AppService } from '@/app';

@Module({
  controllers: [AppController],
  providers: [AppService],
  exports: [],
  imports: [HttpModule],
})
export class RouterCommonModule {}
