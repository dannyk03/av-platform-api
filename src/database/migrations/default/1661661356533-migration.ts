import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1661661356533 implements MigrationInterface {
  name = 'migration1661661356533';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "exec" character varying(50) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "repo_version"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "repo_version" character varying(15) NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "repo_version"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "repo_version" character varying(20) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "exec"
        `);
  }
}
