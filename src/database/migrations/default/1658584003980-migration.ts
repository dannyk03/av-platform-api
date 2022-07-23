import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658584003980 implements MigrationInterface {
  name = 'migration1658584003980';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE INDEX "idx_products_brand" ON "products" ("brand")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_name" ON "product_display_options" ("name")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_description" ON "product_display_options" ("description")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_keywords" ON "product_display_options" ("keywords")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_keywords"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_description"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_name"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_products_brand"
        `);
  }
}
