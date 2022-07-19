import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658232573976 implements MigrationInterface {
  name = 'migration1658232573976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_abilities_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_subjects_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_policies_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_role_presets_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_roles_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_organizations_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_user_auth_configs_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_mobile_number"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_sign_up_email_verification_links_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_sign_up_email_verification_links_sign_up_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles" DROP CONSTRAINT "unique_role_organization"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
                RENAME COLUMN "mobile_number" TO "phone_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
                RENAME CONSTRAINT "uq_users_mobile_number" TO "uq_users_phone_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
                RENAME COLUMN "sign_up_code" TO "code"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
                RENAME CONSTRAINT "uq_sign_up_email_verification_links_sign_up_code" TO "uq_sign_up_email_verification_links_code"
        `);
    await queryRunner.query(`
            CREATE TABLE "organization_invite_links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "email" character varying(50) NOT NULL,
                "code" character varying(32) NOT NULL,
                "used_at" TIMESTAMP,
                "expires_at" TIMESTAMP,
                "role_id" uuid,
                "organization_id" uuid,
                CONSTRAINT "uq_organization_invite_links_email" UNIQUE ("email"),
                CONSTRAINT "uq_organization_invite_links_code" UNIQUE ("code"),
                CONSTRAINT "pk_organization_invite_links_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_organization_invite_links_email" ON "organization_invite_links" ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_organization_invite_links_code" ON "organization_invite_links" ("code")
        `);
    await queryRunner.query(`
            CREATE TABLE "display_languages" (
                "iso_code" character varying(2) NOT NULL,
                "iso_name" character varying(20) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "uq_display_languages_iso_name" UNIQUE ("iso_name"),
                CONSTRAINT "pk_display_languages_iso_code" PRIMARY KEY ("iso_code")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_display_languages_iso_name" ON "display_languages" ("iso_name")
        `);
    await queryRunner.query(`
            CREATE TABLE "products" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "sku" character varying(30) NOT NULL,
                "brand" character varying(30),
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "uq_products_sku" UNIQUE ("sku"),
                CONSTRAINT "pk_products_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_products_sku" ON "products" ("sku")
        `);
    await queryRunner.query(`
            CREATE TABLE "product_display_options" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(50) NOT NULL,
                "description" character varying(200),
                "keywords" character varying(20) array NOT NULL DEFAULT '{}',
                "language_iso_code" character varying(2),
                "product_id" uuid,
                CONSTRAINT "pk_product_display_options_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "product_images" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "file_name" character varying(30) NOT NULL,
                "asset_id" character varying(32) NOT NULL,
                "public_id" character varying(50) NOT NULL,
                "secure_url" character varying(200) NOT NULL,
                "additional_data" jsonb,
                CONSTRAINT "uq_product_images_file_name" UNIQUE ("file_name"),
                CONSTRAINT "uq_product_images_asset_id" UNIQUE ("asset_id"),
                CONSTRAINT "uq_product_images_public_id" UNIQUE ("public_id"),
                CONSTRAINT "uq_product_images_secure_url" UNIQUE ("secure_url"),
                CONSTRAINT "pk_product_images_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_images_file_name" ON "product_images" ("file_name")
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
                "confirmed_at" TIMESTAMP,
                "sent_at" TIMESTAMP,
                "accepted_at" TIMESTAMP,
                "approved_at" TIMESTAMP,
                "shipped_at" TIMESTAMP,
                "delivered_at" TIMESTAMP,
                "recipient_id" uuid,
                "sender_id" uuid,
                "confirmation_link_id" uuid,
                CONSTRAINT "rel_gifts_recipient_id" UNIQUE ("recipient_id"),
                CONSTRAINT "rel_gifts_sender_id" UNIQUE ("sender_id"),
                CONSTRAINT "pk_gifts_id" PRIMARY KEY ("id")
            )
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
            CREATE TABLE "product_display_options_images_product_images" (
                "product_display_options_id" uuid NOT NULL,
                "product_images_id" uuid NOT NULL,
                CONSTRAINT "pk_product_display_options_images_product_images_product_display_options_id_product_images_id" PRIMARY KEY (
                    "product_display_options_id",
                    "product_images_id"
                )
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_display_options_id" ON "product_display_options_images_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_images_id" ON "product_display_options_images_product_images" ("product_images_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities" DROP COLUMN "conditions"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities" DROP COLUMN "fields"
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
            ALTER TABLE "user_auth_configs"
            ADD "login_code_expired_at" TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."acl_subjects_type_enum"
            RENAME TO "acl_subjects_type_enum_old"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acl_subjects_type_enum" AS ENUM(
                'System',
                'Organization',
                'OrganizationInvite',
                'User',
                'Policy',
                'Role',
                'Subject',
                'Ability',
                'CreditCard',
                'Invoice',
                'Payment',
                'Order',
                'Gift',
                'Product',
                'OrganizationNamespace',
                'SecurityNamespace',
                'FinanceNamespace',
                'GiftingNamespace',
                'CatalogNamespace'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_subjects"
            ALTER COLUMN "type" TYPE "public"."acl_subjects_type_enum" USING "type"::"text"::"public"."acl_subjects_type_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acl_subjects_type_enum_old"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ALTER COLUMN "password" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ALTER COLUMN "salt" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ALTER COLUMN "password_expired_at" DROP NOT NULL
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
            ALTER TABLE "users"
            ALTER COLUMN "is_active"
            SET DEFAULT true
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_user_auth_configs_login_code" ON "user_auth_configs" ("login_code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_phone_number" ON "users" ("phone_number")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_email" ON "users" ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_sign_up_email_verification_links_code" ON "sign_up_email_verification_links" ("code")
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles"
            ADD CONSTRAINT "uq_acl_roles_name_organization_id_slug" UNIQUE ("slug", "name", "organization_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links"
            ADD CONSTRAINT "fk_organization_invite_links_role_id" FOREIGN KEY ("role_id") REFERENCES "acl_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links"
            ADD CONSTRAINT "fk_organization_invite_links_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "fk_product_display_options_language_iso_code" FOREIGN KEY ("language_iso_code") REFERENCES "display_languages"("iso_code") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "fk_product_display_options_product_id" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_confirmation_link_id" FOREIGN KEY ("confirmation_link_id") REFERENCES "gift_send_confirmation_links"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_confirmation_link_id"
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
            ALTER TABLE "product_display_options" DROP CONSTRAINT "fk_product_display_options_product_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "fk_product_display_options_language_iso_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links" DROP CONSTRAINT "fk_organization_invite_links_organization_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links" DROP CONSTRAINT "fk_organization_invite_links_role_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles" DROP CONSTRAINT "uq_acl_roles_name_organization_id_slug"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_sign_up_email_verification_links_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_email"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_phone_number"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_user_auth_configs_login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "is_active"
            SET DEFAULT false
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
            ADD "phone_number" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "uq_users_phone_number" UNIQUE ("phone_number")
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "last_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "last_name" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "first_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "first_name" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ALTER COLUMN "password_expired_at"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ALTER COLUMN "salt"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ALTER COLUMN "password"
            SET NOT NULL
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acl_subjects_type_enum_old" AS ENUM(
                'System',
                'Organization',
                'OrganizationInvite',
                'User',
                'Policy',
                'Role',
                'Subject',
                'Ability',
                'CreditCard',
                'Invoice',
                'Payment',
                'Order',
                'Gift',
                'OrganizationNamespace',
                'SecurityNamespace',
                'FinanceNamespace',
                'GiftingNamespace'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_subjects"
            ALTER COLUMN "type" TYPE "public"."acl_subjects_type_enum_old" USING "type"::"text"::"public"."acl_subjects_type_enum_old"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acl_subjects_type_enum"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."acl_subjects_type_enum_old"
            RENAME TO "acl_subjects_type_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP COLUMN "login_code_expired_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP CONSTRAINT "uq_user_auth_configs_login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP COLUMN "login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities"
            ADD "fields" character varying(20) array
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities"
            ADD "conditions" jsonb
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_images_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            DROP TABLE "product_display_options_images_product_images"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_gift_send_confirmation_links_code"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_send_confirmation_links"
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
            DROP INDEX "public"."idx_product_images_file_name"
        `);
    await queryRunner.query(`
            DROP TABLE "product_images"
        `);
    await queryRunner.query(`
            DROP TABLE "product_display_options"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_products_sku"
        `);
    await queryRunner.query(`
            DROP TABLE "products"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_display_languages_iso_name"
        `);
    await queryRunner.query(`
            DROP TABLE "display_languages"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_organization_invite_links_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_organization_invite_links_email"
        `);
    await queryRunner.query(`
            DROP TABLE "organization_invite_links"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
                RENAME CONSTRAINT "uq_sign_up_email_verification_links_code" TO "uq_sign_up_email_verification_links_sign_up_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
                RENAME COLUMN "code" TO "sign_up_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
                RENAME CONSTRAINT "uq_users_phone_number" TO "uq_users_mobile_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
                RENAME COLUMN "phone_number" TO "mobile_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles"
            ADD CONSTRAINT "unique_role_organization" UNIQUE ("slug", "name", "organization_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_sign_up_email_verification_links_sign_up_code" ON "sign_up_email_verification_links" ("sign_up_code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_sign_up_email_verification_links_id" ON "sign_up_email_verification_links" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_mobile_number" ON "users" ("mobile_number")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_id" ON "users" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_user_auth_configs_id" ON "user_auth_configs" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_organizations_id" ON "organizations" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_roles_id" ON "acl_roles" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_role_presets_id" ON "acl_role_presets" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_policies_id" ON "acl_policies" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_subjects_id" ON "acl_subjects" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_abilities_id" ON "acl_abilities" ("id")
        `);
  }
}
