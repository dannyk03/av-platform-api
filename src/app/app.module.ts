import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '@/core/core.module';
import { AppRouterModule } from './app.router.module';

@Module({
  imports: [CoreModule, AppRouterModule.register()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
