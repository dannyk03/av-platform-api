import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1661890837710 implements MigrationInterface {
  name = 'migration1661890837710';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "path"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "path" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "exec"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "exec" character varying(100) NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "exec"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "exec" character varying(50) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "path"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "path" character varying(50) NOT NULL
        `);
  }
}
