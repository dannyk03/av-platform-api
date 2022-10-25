import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1666539746789 implements MigrationInterface {
  name = 'migration1666539746789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD "match_reason" character varying(1000)
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_submits"
            ADD "submit_reason" character varying(1000)
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_submits" DROP COLUMN "personal_note"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_submits"
            ADD "personal_note" character varying(1000)
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests" DROP COLUMN "personal_note"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests"
            ADD "personal_note" character varying(1000)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests" DROP COLUMN "personal_note"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests"
            ADD "personal_note" character varying(500)
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_submits" DROP COLUMN "personal_note"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_submits"
            ADD "personal_note" character varying(500) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_submits" DROP COLUMN "submit_reason"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP COLUMN "match_reason"
        `);
  }
}
