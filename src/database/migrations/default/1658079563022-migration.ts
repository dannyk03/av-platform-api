import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658079563022 implements MigrationInterface {
  name = 'migration1658079563022';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images" DROP CONSTRAINT "fk_product_display_options_product_images_product_display_optio"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_product_images_product_display_opti"
        `);
    await queryRunner.query(`
            CREATE TABLE "guest_gift_sends" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "sender_email" character varying(50) NOT NULL,
                "sender_first_name" character varying(30),
                "sender_last_name" character varying(30),
                "recipient_email" character varying(50) NOT NULL,
                "verify_code" character varying(32) NOT NULL,
                "sent_at" TIMESTAMP,
                "accepted_at" TIMESTAMP,
                "approved_at" TIMESTAMP,
                "shipped_at" TIMESTAMP,
                "delivered_at" TIMESTAMP,
                CONSTRAINT "pk_guest_gift_sends_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_guest_gift_sends_sender_email" ON "guest_gift_sends" ("sender_email")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_guest_gift_sends_recipient_email" ON "guest_gift_sends" ("recipient_email")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_guest_gift_sends_verify_code" ON "guest_gift_sends" ("verify_code")
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "first_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "first_name" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "last_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "last_name" character varying(30)
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_phone_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "uq_users_phone_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "phone_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "phone_number" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "uq_users_phone_number" UNIQUE ("phone_number")
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_email"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "uq_users_email"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email" character varying(50) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "uq_users_email" UNIQUE ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_phone_number" ON "users" ("phone_number")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_email" ON "users" ("email")
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
            DROP INDEX "public"."idx_users_email"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_phone_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "uq_users_email"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "uq_users_email" UNIQUE ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_email" ON "users" ("email")
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "uq_users_phone_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "phone_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "phone_number" character varying(50)
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "uq_users_phone_number" UNIQUE ("phone_number")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_phone_number" ON "users" ("phone_number")
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "last_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "last_name" character varying(50)
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "first_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "first_name" character varying(50)
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_guest_gift_sends_verify_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_guest_gift_sends_recipient_email"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_guest_gift_sends_sender_email"
        `);
    await queryRunner.query(`
            DROP TABLE "guest_gift_sends"
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
