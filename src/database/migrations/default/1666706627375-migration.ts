import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1666706627375 implements MigrationInterface {
  name = 'migration1666706627375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ALTER COLUMN "match_reason"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_submits"
            ALTER COLUMN "personal_note" DROP NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_submits"
            ALTER COLUMN "personal_note"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ALTER COLUMN "match_reason" DROP NOT NULL
        `);
  }
}
