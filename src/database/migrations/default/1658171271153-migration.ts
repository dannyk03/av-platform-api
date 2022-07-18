import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658171271153 implements MigrationInterface {
  name = 'migration1658171271153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_displa"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_images"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_displ"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_image"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
                RENAME COLUMN "properties" TO "additional_data"
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_recipients" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "additional_data" jsonb,
                "user_id" uuid,
                CONSTRAINT "pk_gift_recipients_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_senders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "additional_data" jsonb,
                "user_id" uuid,
                CONSTRAINT "pk_gift_senders_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "gifts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "sent_at" TIMESTAMP,
                "accepted_at" TIMESTAMP,
                "approved_at" TIMESTAMP,
                "shipped_at" TIMESTAMP,
                "delivered_at" TIMESTAMP,
                "recipient_id" uuid,
                "sender_id" uuid,
                CONSTRAINT "rel_gifts_recipient_id" UNIQUE ("recipient_id"),
                CONSTRAINT "rel_gifts_sender_id" UNIQUE ("sender_id"),
                CONSTRAINT "pk_gifts_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_display_options_id" ON "product_display_options_images_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_images_id" ON "product_display_options_images_product_images" ("product_images_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_recipients"
            ADD CONSTRAINT "fk_gift_recipients_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_senders"
            ADD CONSTRAINT "fk_gift_senders_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_recipient_id" FOREIGN KEY ("recipient_id") REFERENCES "gift_recipients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_sender_id" FOREIGN KEY ("sender_id") REFERENCES "gift_senders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_sender_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_recipient_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_senders" DROP CONSTRAINT "fk_gift_senders_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_recipients" DROP CONSTRAINT "fk_gift_recipients_user_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_images_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            DROP TABLE "gifts"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_senders"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_recipients"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
                RENAME COLUMN "additional_data" TO "properties"
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_image" ON "product_display_options_images_product_images" ("product_images_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_displ" ON "product_display_options_images_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images"
            ADD CONSTRAINT "fk_product_display_options_images_product_images_product_images" FOREIGN KEY ("product_images_id") REFERENCES "product_images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images"
            ADD CONSTRAINT "fk_product_display_options_images_product_images_product_displa" FOREIGN KEY ("product_display_options_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }
}
