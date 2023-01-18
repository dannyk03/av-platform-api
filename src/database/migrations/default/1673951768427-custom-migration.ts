import { NestFactory } from '@nestjs/core';

import { MigrationInterface } from 'typeorm';

import { CommandsModule } from '@/database/commands/commands.module';

import { GroupShortCodePopulateCommandService } from '@/database/commands/command/service';

export class customMigration1673951768427 implements MigrationInterface {
  name = 'customMigration1673951768427';

  public async up(): Promise<void> {
    const app = await NestFactory.createApplicationContext(CommandsModule);
    try {
      await app.get(GroupShortCodePopulateCommandService).run();
      await app.close();
    } catch (error) {
      console.log(error);
      await app.close();
      process.exit(1);
    }
  }

  public async down(): Promise<void> {
    // do nothing
  }
}
