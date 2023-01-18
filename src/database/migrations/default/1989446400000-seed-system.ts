import { NestFactory } from '@nestjs/core';

import { MigrationInterface } from 'typeorm';

import { CommandsModule } from '@/database/commands/commands.module';

import { SystemSeedService } from '@/database/commands/seed/service';

export class seed1989446400000 implements MigrationInterface {
  name = 'seed1989446400000';

  public async up(): Promise<void> {
    const app = await NestFactory.createApplicationContext(CommandsModule);

    try {
      await app.get(SystemSeedService).insert();
      await app.close();
    } catch (error) {
      await app.close();
      process.exit(1);
    }
  }

  public async down(): Promise<void> {
    // do nothing
  }
}
