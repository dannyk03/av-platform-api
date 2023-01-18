import { NestFactory } from '@nestjs/core';

import { MigrationInterface } from 'typeorm';

import { CommandsModule } from '@/database/commands/commands.module';

import {
  StringEscapeRevertGroupsCommandService,
  StringEscapeRevertProductsCommandService,
  StringEscapeRevertUsersCommandService,
} from '@/database/commands/command/service';

export class customMigration1673952203185 implements MigrationInterface {
  name = 'customMigration1673952203185';

  public async up(): Promise<void> {
    const app = await NestFactory.createApplicationContext(CommandsModule);
    try {
      await app.get(StringEscapeRevertUsersCommandService).run();
      await app.get(StringEscapeRevertGroupsCommandService).run();
      await app.get(StringEscapeRevertProductsCommandService).run();
      await app.close();
    } catch (error) {
      console.error(error);
      await app.close();
      process.exit(1);
    }
  }

  public async down(): Promise<void> {
    // do nothing
  }
}
