import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1661615869961 implements MigrationInterface {
  name = 'migration1661615869961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "original_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "path" character varying(50) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "repo_version" character varying(20) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "data" jsonb
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ALTER COLUMN "tags"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ALTER COLUMN "tags"
            SET DEFAULT '{}'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs"
            ALTER COLUMN "tags" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ALTER COLUMN "tags" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "data"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "repo_version"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "path"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "original_url" character varying(50) NOT NULL
        `);
  }
}
