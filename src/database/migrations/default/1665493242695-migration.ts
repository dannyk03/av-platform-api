import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1665493242695 implements MigrationInterface {
  name = 'migration1665493242695';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "fun_facts" character varying(500) array NOT NULL DEFAULT '{}'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "fun_facts"
        `);
  }
}
