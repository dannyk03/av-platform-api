import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1657966077482 implements MigrationInterface {
  name = 'migration1657966077482';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images" DROP CONSTRAINT "fk_product_display_options_product_images_product_display_optio"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_product_images_product_display_opti"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "name"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "url"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "file_name" character varying(30) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_file_name" UNIQUE ("file_name")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "asset_id" character varying(32) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_asset_id" UNIQUE ("asset_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "secure_url" character varying(50) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_secure_url" UNIQUE ("secure_url")
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."product_images_mime_enum" AS ENUM('image/jpg', 'image/jpeg', 'image/png')
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "mime" "public"."product_images_mime_enum" NOT NULL
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
            ALTER TABLE "product_images" DROP COLUMN "mime"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."product_images_mime_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_secure_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "secure_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_asset_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "asset_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_file_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "file_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "url" character varying(50) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_url" UNIQUE ("url")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "name" character varying(30) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_name" UNIQUE ("name")
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
