import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667507004120 implements MigrationInterface {
  name = 'migration1667507004120';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ALTER COLUMN "name" TYPE character varying(75)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ALTER COLUMN "name" TYPE character varying(50)
        `);
  }
}
