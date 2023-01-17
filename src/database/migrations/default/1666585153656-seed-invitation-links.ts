import { NestFactory } from '@nestjs/core';

import { MigrationInterface } from 'typeorm';

import { SeedsModule } from '@/database/seed/seeds.module';

import { InvitationLinkSeedService } from '@/database/seed/service';

export class seed1666585153656 implements MigrationInterface {
  name = 'seed1666585153656';

  public async up(): Promise<void> {
    const app = await NestFactory.createApplicationContext(SeedsModule);
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
