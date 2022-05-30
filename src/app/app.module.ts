import { Module } from '@nestjs/common';
import { CoreModule } from '@/core/core.module';
import { TaskModule } from '@/task/task.module';
import { RouterAppModule } from '@/router';
@Module({
    controllers: [],
    providers: [],
    imports: [
        // Core
        CoreModule,

        // Task
        TaskModule.register(),

        // Router
        RouterAppModule.register(),
    ],
})
export class AppModule {}
