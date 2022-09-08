import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1661264933229 implements MigrationInterface {
  name = 'migration1661264933229';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests"
            ADD "personal_note" character varying(500)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests" DROP COLUMN "personal_note"
        `);
  }
}
