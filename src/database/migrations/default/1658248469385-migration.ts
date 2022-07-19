import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658248469385 implements MigrationInterface {
  name = 'migration1658248469385';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_images"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_displa"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_displ"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_image"
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_display_options_id" ON "product_display_options_images_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_images_id" ON "product_display_options_images_product_images" ("product_images_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images"
            ADD CONSTRAINT "fk_product_display_options_images_product_images_product_display_options_id" FOREIGN KEY ("product_display_options_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images"
            ADD CONSTRAINT "fk_product_display_options_images_product_images_product_images_id" FOREIGN KEY ("product_images_id") REFERENCES "product_images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_images_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_images_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_image" ON "product_display_options_images_product_images" ("product_images_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_displ" ON "product_display_options_images_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images"
            ADD CONSTRAINT "fk_product_display_options_images_product_images_product_displa" FOREIGN KEY ("product_display_options_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images"
            ADD CONSTRAINT "fk_product_display_options_images_product_images_product_images" FOREIGN KEY ("product_images_id") REFERENCES "product_images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
