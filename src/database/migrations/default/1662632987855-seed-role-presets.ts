import { NestFactory } from '@nestjs/core';

import { MigrationInterface } from 'typeorm';

import { SeedsModule } from '@/database/seed/seeds.module';

import { RolePresetsSeedService } from '@/database/seed/service';

export class seed1662632987855 implements MigrationInterface {
  name = 'seed1662632987855';

  public async up(): Promise<void> {
    const app = await NestFactory.createApplicationContext(SeedsModule);

    try {
      await app.get(RolePresetsSeedService).insert();
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
