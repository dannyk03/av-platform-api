import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1661270794191 implements MigrationInterface {
  name = 'migration1661270794191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_submits"
            ADD "personal_note" character varying(500) NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_submits" DROP COLUMN "personal_note"
        `);
  }
}
