import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1669841199411 implements MigrationInterface {
  name = 'migration1669841199411';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "logs"
        ALTER COLUMN "tags" TYPE character varying(200)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "logs"
        ALTER COLUMN "tags" TYPE character varying(20)
    `);
  }
}
