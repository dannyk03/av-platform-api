import { Module } from '@nestjs/common';

import { AppRouterModule } from './app.router.module';
import { CoreModule } from '@/core/core.module';
import { TaskModule } from '@/task/task.module';

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
