import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658228406146 implements MigrationInterface {
  name = 'migration1658228406146';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_images"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_displa"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_image"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_displ"
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_send_confirmation_links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "code" character varying(32) NOT NULL,
                "used_at" TIMESTAMP,
                "expires_at" TIMESTAMP,
                CONSTRAINT "uq_gift_send_confirmation_links_code" UNIQUE ("code"),
                CONSTRAINT "pk_gift_send_confirmation_links_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_gift_send_confirmation_links_code" ON "gift_send_confirmation_links" ("code")
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
            DROP INDEX "public"."idx_gift_send_confirmation_links_code"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_send_confirmation_links"
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_displ" ON "product_display_options_images_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_image" ON "product_display_options_images_product_images" ("product_images_id")
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
