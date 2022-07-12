import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1657631732275 implements MigrationInterface {
  name = 'migration1657631732275';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user_auth_configs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "password" character varying(100) NOT NULL,
                "salt" character varying(100) NOT NULL,
                "password_expired_at" TIMESTAMP NOT NULL,
                "email_verified_at" TIMESTAMP,
                CONSTRAINT "pk_user_auth_configs_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_user_auth_configs_id" ON "user_auth_configs" ("id")
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acl_abilities_type_enum" AS ENUM('can', 'cannot')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acl_abilities_action_enum" AS ENUM(
                'manage',
                'access',
                'modify',
                'create',
                'update',
                'read',
                'delete'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "acl_abilities" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "type" "public"."acl_abilities_type_enum" NOT NULL,
                "action" "public"."acl_abilities_action_enum" NOT NULL,
                "fields" character varying(20) array,
                "conditions" jsonb,
                "subject_id" uuid,
                CONSTRAINT "pk_acl_abilities_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_abilities_id" ON "acl_abilities" ("id")
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
                'OrganizationNamespace',
                'SecurityNamespace',
                'FinanceNamespace',
                'GiftingNamespace'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "acl_subjects" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "type" "public"."acl_subjects_type_enum" NOT NULL,
                "policy_id" uuid,
                CONSTRAINT "pk_acl_subjects_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_subjects_id" ON "acl_subjects" ("id")
        `);
    await queryRunner.query(`
            CREATE TABLE "acl_policies" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "pk_acl_policies_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_policies_id" ON "acl_policies" ("id")
        `);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "first_name" character varying,
                "last_name" character varying,
                "mobile_number" character varying,
                "email" character varying(100) NOT NULL,
                "title" character varying(100),
                "is_active" boolean NOT NULL DEFAULT false,
                "auth_config_id" uuid,
                "role_id" uuid,
                "organization_id" uuid,
                CONSTRAINT "uq_users_mobile_number" UNIQUE ("mobile_number"),
                CONSTRAINT "uq_users_email" UNIQUE ("email"),
                CONSTRAINT "rel_users_auth_config_id" UNIQUE ("auth_config_id"),
                CONSTRAINT "pk_users_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_id" ON "users" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_mobile_number" ON "users" ("mobile_number")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_email" ON "users" ("email")
        `);
    await queryRunner.query(`
            CREATE TABLE "acl_roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "slug" character varying(30) NOT NULL,
                "name" character varying(30) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "organization_id" uuid,
                "policy_id" uuid,
                CONSTRAINT "unique_role_organization" UNIQUE ("slug", "name", "organization_id"),
                CONSTRAINT "rel_acl_roles_policy_id" UNIQUE ("policy_id"),
                CONSTRAINT "pk_acl_roles_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_roles_id" ON "acl_roles" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_roles_slug" ON "acl_roles" ("slug")
        `);
    await queryRunner.query(`
            CREATE TABLE "organizations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(30) NOT NULL,
                "slug" character varying(30) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "uq_organizations_name" UNIQUE ("name"),
                CONSTRAINT "uq_organizations_slug" UNIQUE ("slug"),
                CONSTRAINT "pk_organizations_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_organizations_id" ON "organizations" ("id")
        `);
    await queryRunner.query(`
            CREATE TABLE "organization_invites" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "email" character varying(50) NOT NULL,
                "invite_code" character varying(32) NOT NULL,
                "used_at" TIMESTAMP,
                "expires_at" TIMESTAMP,
                "role_id" uuid,
                "organization_id" uuid,
                CONSTRAINT "uq_organization_invites_email" UNIQUE ("email"),
                CONSTRAINT "uq_organization_invites_invite_code" UNIQUE ("invite_code"),
                CONSTRAINT "pk_organization_invites_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_organization_invites_id" ON "organization_invites" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_organization_invites_email" ON "organization_invites" ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_organization_invites_invite_code" ON "organization_invites" ("invite_code")
        `);
    await queryRunner.query(`
            CREATE TABLE "logs" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "level" character varying NOT NULL,
                "action" character varying NOT NULL,
                "description" character varying,
                "tags" character varying(20) array,
                "correlation_id" uuid NOT NULL,
                "user_agent" json NOT NULL,
                "method" character varying(20) NOT NULL,
                "original_url" character varying(50) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                CONSTRAINT "pk_logs_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "sign_up_email_verification_links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "email" character varying(50) NOT NULL,
                "sign_up_code" character varying(32) NOT NULL,
                "used_at" TIMESTAMP,
                "expires_at" TIMESTAMP,
                "user_agent" json NOT NULL,
                "user_id" uuid,
                CONSTRAINT "uq_sign_up_email_verification_links_email" UNIQUE ("email"),
                CONSTRAINT "uq_sign_up_email_verification_links_sign_up_code" UNIQUE ("sign_up_code"),
                CONSTRAINT "rel_sign_up_email_verification_links_user_id" UNIQUE ("user_id"),
                CONSTRAINT "pk_sign_up_email_verification_links_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_sign_up_email_verification_links_id" ON "sign_up_email_verification_links" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_sign_up_email_verification_links_email" ON "sign_up_email_verification_links" ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_sign_up_email_verification_links_sign_up_code" ON "sign_up_email_verification_links" ("sign_up_code")
        `);
    await queryRunner.query(`
            CREATE TABLE "acl_role_presets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "slug" character varying(30) NOT NULL,
                "name" character varying(30) NOT NULL,
                "policy_id" uuid,
                CONSTRAINT "uq_acl_role_presets_slug" UNIQUE ("slug"),
                CONSTRAINT "uq_acl_role_presets_name" UNIQUE ("name"),
                CONSTRAINT "rel_acl_role_presets_policy_id" UNIQUE ("policy_id"),
                CONSTRAINT "pk_acl_role_presets_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_role_presets_id" ON "acl_role_presets" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_acl_role_presets_slug" ON "acl_role_presets" ("slug")
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."gift_sends_status_enum" AS ENUM(
                'New',
                'PendingRecipientSubmit',
                'PendingSenderSubmit',
                'Submitted',
                'InDelivery',
                'Delivered'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_sends" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "recipient_email" character varying(100) NOT NULL,
                "sent_at" TIMESTAMP,
                "status" "public"."gift_sends_status_enum" NOT NULL DEFAULT 'New',
                "sender_id" uuid,
                CONSTRAINT "pk_gift_sends_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_gift_sends_id" ON "gift_sends" ("id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_gift_sends_recipient_email" ON "gift_sends" ("recipient_email")
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities"
            ADD CONSTRAINT "fk_acl_abilities_subject_id" FOREIGN KEY ("subject_id") REFERENCES "acl_subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_subjects"
            ADD CONSTRAINT "fk_acl_subjects_policy_id" FOREIGN KEY ("policy_id") REFERENCES "acl_policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_auth_config_id" FOREIGN KEY ("auth_config_id") REFERENCES "user_auth_configs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_role_id" FOREIGN KEY ("role_id") REFERENCES "acl_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles"
            ADD CONSTRAINT "fk_acl_roles_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles"
            ADD CONSTRAINT "fk_acl_roles_policy_id" FOREIGN KEY ("policy_id") REFERENCES "acl_policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invites"
            ADD CONSTRAINT "fk_organization_invites_role_id" FOREIGN KEY ("role_id") REFERENCES "acl_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invites"
            ADD CONSTRAINT "fk_organization_invites_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD CONSTRAINT "fk_logs_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
            ADD CONSTRAINT "fk_sign_up_email_verification_links_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_role_presets"
            ADD CONSTRAINT "fk_acl_role_presets_policy_id" FOREIGN KEY ("policy_id") REFERENCES "acl_policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_sends"
            ADD CONSTRAINT "fk_gift_sends_sender_id" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_sends" DROP CONSTRAINT "fk_gift_sends_sender_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_role_presets" DROP CONSTRAINT "fk_acl_role_presets_policy_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links" DROP CONSTRAINT "fk_sign_up_email_verification_links_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP CONSTRAINT "fk_logs_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invites" DROP CONSTRAINT "fk_organization_invites_organization_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invites" DROP CONSTRAINT "fk_organization_invites_role_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles" DROP CONSTRAINT "fk_acl_roles_policy_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles" DROP CONSTRAINT "fk_acl_roles_organization_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_organization_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_role_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_auth_config_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_subjects" DROP CONSTRAINT "fk_acl_subjects_policy_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities" DROP CONSTRAINT "fk_acl_abilities_subject_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_gift_sends_recipient_email"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_gift_sends_id"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_sends"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."gift_sends_status_enum"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_role_presets_slug"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_role_presets_id"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_role_presets"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_sign_up_email_verification_links_sign_up_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_sign_up_email_verification_links_email"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_sign_up_email_verification_links_id"
        `);
    await queryRunner.query(`
            DROP TABLE "sign_up_email_verification_links"
        `);
    await queryRunner.query(`
            DROP TABLE "logs"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_organization_invites_invite_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_organization_invites_email"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_organization_invites_id"
        `);
    await queryRunner.query(`
            DROP TABLE "organization_invites"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_organizations_id"
        `);
    await queryRunner.query(`
            DROP TABLE "organizations"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_roles_slug"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_roles_id"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_roles"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_email"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_mobile_number"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_id"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_policies_id"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_policies"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_subjects_id"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_subjects"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acl_subjects_type_enum"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_acl_abilities_id"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_abilities"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acl_abilities_action_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acl_abilities_type_enum"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_user_auth_configs_id"
        `);
    await queryRunner.query(`
            DROP TABLE "user_auth_configs"
        `);
  }
}
