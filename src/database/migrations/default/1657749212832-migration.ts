import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1657749212832 implements MigrationInterface {
  name = 'migration1657749212832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "acl_abilities" DROP COLUMN "conditions"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities" DROP COLUMN "fields"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "acl_abilities"
            ADD "fields" character varying(30) array
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities"
            ADD "conditions" jsonb
        `);
  }
}
