import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1657968570601 implements MigrationInterface {
  name = 'migration1657968570601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images" DROP CONSTRAINT "fk_product_display_options_product_images_product_display_optio"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_product_images_product_display_opti"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "mime"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."product_images_mime_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_public_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "public_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "public_id" character varying(50) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_public_id" UNIQUE ("public_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_secure_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "secure_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "secure_url" character varying(200) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_secure_url" UNIQUE ("secure_url")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_images_file_name" ON "product_images" ("file_name")
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
            DROP INDEX "public"."idx_product_images_file_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_secure_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "secure_url"
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
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_public_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "public_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "public_id" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_public_id" UNIQUE ("public_id")
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."product_images_mime_enum" AS ENUM('image/jpg', 'image/jpeg', 'image/png')
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "mime" "public"."product_images_mime_enum" NOT NULL
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
