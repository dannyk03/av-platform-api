import { Module } from '@nestjs/common';
import { CoreModule } from '@/core/core.module';
import { AppRouterModule } from './app.router.module';

@Module({
  imports: [CoreModule, AppRouterModule.register()],
  controllers: [],
  providers: [],
})
export class AppModule {}
