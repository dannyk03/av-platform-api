import { Module } from '@nestjs/common';

import { AppRouterModule } from './app.router.module';
import { CommonModule } from '@/common/common.module';
import { JobsModule } from '@/jobs/jobs.module';

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
