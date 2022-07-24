import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658684635201 implements MigrationInterface {
  name = 'migration1658684635201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "fk_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
                RENAME COLUMN "product_display_options_id" TO "product_display_option_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "fk_product_images_product_display_option_id" FOREIGN KEY ("product_display_option_id") REFERENCES "product_display_options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "fk_product_images_product_display_option_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
                RENAME COLUMN "product_display_option_id" TO "product_display_options_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "fk_product_images_product_display_options_id" FOREIGN KEY ("product_display_options_id") REFERENCES "product_display_options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
