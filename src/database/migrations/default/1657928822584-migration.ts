import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1657928822584 implements MigrationInterface {
  name = 'migration1657928822584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images" DROP CONSTRAINT "fk_product_display_options_product_images_product_display_optio"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_product_images_product_display_opti"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD "keywords" character varying(20) array NOT NULL DEFAULT '{}'
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_product_images_product_display_options_id" ON "product_display_options_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images"
            ADD CONSTRAINT "fk_product_display_options_product_images_product_display_options_id" FOREIGN KEY ("product_display_options_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images" DROP CONSTRAINT "fk_product_display_options_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP COLUMN "keywords"
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_product_images_product_display_opti" ON "product_display_options_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images"
            ADD CONSTRAINT "fk_product_display_options_product_images_product_display_optio" FOREIGN KEY ("product_display_options_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }
}
