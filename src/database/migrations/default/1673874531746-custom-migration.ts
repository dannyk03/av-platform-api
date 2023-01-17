import { NestFactory } from '@nestjs/core';

import { MigrationInterface } from 'typeorm';

import { CommandsModule } from '@/database/commands/commands.module';

import {
  StringEscapeRevertGroupsCommandService,
  StringEscapeRevertProductsCommandService,
  StringEscapeRevertUsersCommandService,
} from '@/database/commands/command/service';

export class customMigration1673874531746 implements MigrationInterface {
  name = 'customMigration1673874531746';

  public async up(): Promise<void> {
    const app = await NestFactory.createApplicationContext(CommandsModule);
    try {
      await app.get(StringEscapeRevertUsersCommandService).run();
      await app.get(StringEscapeRevertGroupsCommandService).run();
      await app.get(StringEscapeRevertProductsCommandService).run();
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
