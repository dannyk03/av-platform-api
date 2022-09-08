import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1660647453979 implements MigrationInterface {
  name = 'migration1660647453979';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_intents"
                RENAME COLUMN "sent_at" TO "confirmed_at"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_intents"
                RENAME COLUMN "confirmed_at" TO "sent_at"
        `);
  }
}
