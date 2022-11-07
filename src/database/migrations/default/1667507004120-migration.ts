import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667507004120 implements MigrationInterface {
  name = 'migration1667507004120';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP COLUMN "name"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD "name" character varying(75) NOT NULL
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_name" ON "product_display_options" ("name")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP COLUMN "name"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD "name" character varying(50) NOT NULL
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_name" ON "product_display_options" ("name")
        `);
  }
}
