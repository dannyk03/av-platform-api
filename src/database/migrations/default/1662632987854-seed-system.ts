import { NestFactory } from '@nestjs/core';

import { MigrationInterface } from 'typeorm';

import { SeedsModule } from '@/database/seed/seeds.module';

import { SystemSeedService } from '@/database/seed/service';

export class seed1662632987854 implements MigrationInterface {
  name = 'seed1662632987854';

  public async up(): Promise<void> {
    const app = await NestFactory.createApplicationContext(SeedsModule);

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
