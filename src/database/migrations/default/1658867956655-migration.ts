import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658867956655 implements MigrationInterface {
  name = 'migration1658867956655';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
            ADD "login_code" character varying(16)
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
            ADD "code" character varying(16) NOT NULL
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
            ADD "code" character varying(16) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
            ADD CONSTRAINT "uq_sign_up_email_verification_links_code" UNIQUE ("code")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_asset_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "asset_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "asset_id" character varying(16) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_asset_id" UNIQUE ("asset_id")
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
            ADD "code" character varying(16) NOT NULL
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
            ADD "code" character varying(32) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_send_confirmation_links"
            ADD CONSTRAINT "uq_gift_send_confirmation_links_code" UNIQUE ("code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_gift_send_confirmation_links_code" ON "gift_send_confirmation_links" ("code")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_asset_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "asset_id"
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
            ALTER TABLE "sign_up_email_verification_links" DROP CONSTRAINT "uq_sign_up_email_verification_links_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links" DROP COLUMN "code"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
            ADD "code" character varying(32) NOT NULL
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
            ADD "code" character varying(32) NOT NULL
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
            ADD "login_code" character varying(32)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD CONSTRAINT "uq_user_auth_configs_login_code" UNIQUE ("login_code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_user_auth_configs_login_code" ON "user_auth_configs" ("login_code")
        `);
  }
}
