import { Module } from '@nestjs/common';

import { AppRouterModule } from './app.router.module';
import { CommonModule } from '@/core/core.module';
import { JobsModule } from '@/task/task.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    CommonModule,

    // Jobs
    JobsModule.register(),

    // Router
    AppRouterModule.register(),
  ],
})
export class AppModule {}
