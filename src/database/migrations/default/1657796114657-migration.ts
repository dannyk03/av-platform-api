import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1657796114657 implements MigrationInterface {
  name = 'migration1657796114657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "uq_product_display_options_language_iso_code_product_id"
        `);
    await queryRunner.query(`
            CREATE TABLE "product_images" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(30) NOT NULL,
                "url" character varying(50) NOT NULL,
                "properties" jsonb,
                CONSTRAINT "uq_product_images_name" UNIQUE ("name"),
                CONSTRAINT "uq_product_images_url" UNIQUE ("url"),
                CONSTRAINT "pk_product_images_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "product_display_options_product_images" (
                "product_display_options_id" uuid NOT NULL,
                "product_images_id" uuid NOT NULL,
                CONSTRAINT "pk_product_display_options_product_images_product_display_options_id_product_images_id" PRIMARY KEY (
                    "product_display_options_id",
                    "product_images_id"
                )
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_product_images_product_display_options_id" ON "product_display_options_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_product_images_product_images_id" ON "product_display_options_product_images" ("product_images_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP COLUMN "image_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ALTER COLUMN "description" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images"
            ADD CONSTRAINT "fk_product_display_options_product_images_product_display_options_id" FOREIGN KEY ("product_display_options_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images"
            ADD CONSTRAINT "fk_product_display_options_product_images_product_images_id" FOREIGN KEY ("product_images_id") REFERENCES "product_images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images" DROP CONSTRAINT "fk_product_display_options_product_images_product_images_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images" DROP CONSTRAINT "fk_product_display_options_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ALTER COLUMN "description"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD "image_url" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_product_images_product_images_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            DROP TABLE "product_display_options_product_images"
        `);
    await queryRunner.query(`
            DROP TABLE "product_images"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "uq_product_display_options_language_iso_code_product_id" UNIQUE ("language_iso_code", "product_id")
        `);
  }
}
