import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658949960376 implements MigrationInterface {
  name = 'migration1658949960376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "fk_product_display_options_product_id"`);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "fk_product_images_product_display_option_id"`);

    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "fk_product_display_options_product_id" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "fk_product_images_product_display_option_id" FOREIGN KEY ("product_display_option_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "fk_product_display_options_product_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "fk_product_images_product_display_option_id"
        `);
  }
}
