import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1669910351724 implements MigrationInterface {
  name = 'migration1669910351724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profile_companies"
                RENAME COLUMN "role" TO "job_role"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "tags"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "tags" character varying(200) array NOT NULL DEFAULT '{}'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "tags"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "tags" character varying(200) NOT NULL DEFAULT '{}'
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_companies"
                RENAME COLUMN "job_role" TO "role"
        `);
  }
}
