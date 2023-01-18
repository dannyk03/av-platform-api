import { NestFactory } from '@nestjs/core';

import { MigrationInterface } from 'typeorm';

import { CommandsModule } from '@/database/commands/commands.module';

import { InvitationLinkSeedService } from '@/database/commands/seed/service';

export class seed1666585153656 implements MigrationInterface {
  name = 'seed1666585153656';

  public async up(): Promise<void> {
    const app = await NestFactory.createApplicationContext(CommandsModule);
    try {
      await app.get(InvitationLinkSeedService).insert();
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
