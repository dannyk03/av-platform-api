import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1657734957124 implements MigrationInterface {
  name = 'migration1657734957124';

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
            DROP INDEX "public"."idx_organization_invites_id"
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
            DROP INDEX "public"."idx_sign_up_email_verification_links_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_role_presets_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_gift_sends_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles" DROP CONSTRAINT "unique_role_organization"
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
            CREATE TABLE "product_display_options" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "image_url" character varying(100) NOT NULL,
                "name" character varying(50) NOT NULL,
                "description" character varying(200) NOT NULL,
                "language_iso_code" character varying(2),
                "product_id" uuid,
                CONSTRAINT "uq_product_display_option_language" UNIQUE ("language_iso_code", "product_id"),
                CONSTRAINT "rel_product_display_options_language_iso_code" UNIQUE ("language_iso_code"),
                CONSTRAINT "pk_product_display_options_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities" DROP COLUMN "fields"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities"
            ADD "fields" character varying(30) array
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "first_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "first_name" character varying(50)
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "last_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "last_name" character varying(50)
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
            ALTER TABLE "acl_roles"
            ADD CONSTRAINT "uq_role_organization" UNIQUE ("slug", "name", "organization_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "fk_product_display_options_language_iso_code" FOREIGN KEY ("language_iso_code") REFERENCES "display_languages"("iso_code") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "fk_product_display_options_product_id" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "fk_product_display_options_product_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "fk_product_display_options_language_iso_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles" DROP CONSTRAINT "uq_role_organization"
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
            ADD "phone_number" character varying
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
            ALTER TABLE "acl_abilities" DROP COLUMN "fields"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities"
            ADD "fields" character varying(20) array
        `);
    await queryRunner.query(`
            DROP TABLE "product_display_options"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_display_languages_iso_name"
        `);
    await queryRunner.query(`
            DROP TABLE "display_languages"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_products_sku"
        `);
    await queryRunner.query(`
            DROP TABLE "products"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles"
            ADD CONSTRAINT "unique_role_organization" UNIQUE ("slug", "name", "organization_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_gift_sends_id" ON "gift_sends" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_role_presets_id" ON "acl_role_presets" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_sign_up_email_verification_links_id" ON "sign_up_email_verification_links" ("id")
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
            CREATE INDEX "idx_organization_invites_id" ON "organization_invites" ("id")
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
