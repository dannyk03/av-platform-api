import { NestFactory } from '@nestjs/core';

import { MigrationInterface, QueryRunner } from 'typeorm';

import { SeedsModule } from '@/database/seed/seeds.module';

import { InvitationLinkSeedService } from '@/database/seed/service';

export class custom1666585153656 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    // do nothing
  }
}
