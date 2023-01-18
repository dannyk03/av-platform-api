import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1673950332871 implements MigrationInterface {
  name = 'migration1673950332871';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "groups"
            ADD "code" character varying(21)
        `);
    await queryRunner.query(`
            ALTER TABLE "groups"
            ADD CONSTRAINT "uq_groups_code" UNIQUE ("code")
        `);
    await queryRunner.query(`
            ALTER TABLE "groups" DROP CONSTRAINT "uq_groups_name"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "groups"
            ADD CONSTRAINT "uq_groups_name" UNIQUE ("name")
        `);
    await queryRunner.query(`
            ALTER TABLE "groups" DROP CONSTRAINT "uq_groups_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups" DROP COLUMN "code"
        `);
  }
}
