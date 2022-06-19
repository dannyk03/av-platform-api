import { Module } from '@nestjs/common';
import { CoreModule } from '@/core/core.module';
import { TaskModule } from '@/task/task.module';
import { AppRouterModule } from './app.router.module';
@Module({
  controllers: [],
  providers: [],
  imports: [
    // Core
    CoreModule,

    // Task
    TaskModule.register(),

    // Router
    AppRouterModule.register(),
  ],
})
export class AppModule {}
