import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658960139816 implements MigrationInterface {
  name = 'migration1658960139816';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "fk_product_display_options_product_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "fk_product_images_product_display_option_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_user_auth_configs_login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP CONSTRAINT "uq_user_auth_configs_login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP COLUMN "login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD "login_code" character varying(21)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD CONSTRAINT "uq_user_auth_configs_login_code" UNIQUE ("login_code")
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_organization_invite_links_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links" DROP CONSTRAINT "uq_organization_invite_links_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links" DROP COLUMN "code"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links"
            ADD "code" character varying(21) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links"
            ADD CONSTRAINT "uq_organization_invite_links_code" UNIQUE ("code")
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_sign_up_email_verification_links_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links" DROP CONSTRAINT "uq_sign_up_email_verification_links_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links" DROP COLUMN "code"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
            ADD "code" character varying(21) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
            ADD CONSTRAINT "uq_sign_up_email_verification_links_code" UNIQUE ("code")
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_gift_send_confirmation_links_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_send_confirmation_links" DROP CONSTRAINT "uq_gift_send_confirmation_links_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_send_confirmation_links" DROP COLUMN "code"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_send_confirmation_links"
            ADD "code" character varying(21) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_send_confirmation_links"
            ADD CONSTRAINT "uq_gift_send_confirmation_links_code" UNIQUE ("code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_user_auth_configs_login_code" ON "user_auth_configs" ("login_code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_organization_invite_links_code" ON "organization_invite_links" ("code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_sign_up_email_verification_links_code" ON "sign_up_email_verification_links" ("code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_gift_send_confirmation_links_code" ON "gift_send_confirmation_links" ("code")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "fk_product_display_options_product_id" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "fk_product_images_product_display_option_id" FOREIGN KEY ("product_display_option_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "fk_product_images_product_display_option_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "fk_product_display_options_product_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_gift_send_confirmation_links_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_sign_up_email_verification_links_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_organization_invite_links_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_user_auth_configs_login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_send_confirmation_links" DROP CONSTRAINT "uq_gift_send_confirmation_links_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_send_confirmation_links" DROP COLUMN "code"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_send_confirmation_links"
            ADD "code" character varying(16) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_send_confirmation_links"
            ADD CONSTRAINT "uq_gift_send_confirmation_links_code" UNIQUE ("code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_gift_send_confirmation_links_code" ON "gift_send_confirmation_links" ("code")
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links" DROP CONSTRAINT "uq_sign_up_email_verification_links_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links" DROP COLUMN "code"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
            ADD "code" character varying(16) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
            ADD CONSTRAINT "uq_sign_up_email_verification_links_code" UNIQUE ("code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_sign_up_email_verification_links_code" ON "sign_up_email_verification_links" ("code")
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links" DROP CONSTRAINT "uq_organization_invite_links_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links" DROP COLUMN "code"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links"
            ADD "code" character varying(16) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links"
            ADD CONSTRAINT "uq_organization_invite_links_code" UNIQUE ("code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_organization_invite_links_code" ON "organization_invite_links" ("code")
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP CONSTRAINT "uq_user_auth_configs_login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP COLUMN "login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD "login_code" character varying(16)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD CONSTRAINT "uq_user_auth_configs_login_code" UNIQUE ("login_code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_user_auth_configs_login_code" ON "user_auth_configs" ("login_code")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "fk_product_images_product_display_option_id" FOREIGN KEY ("product_display_option_id") REFERENCES "product_display_options"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "fk_product_display_options_product_id" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
