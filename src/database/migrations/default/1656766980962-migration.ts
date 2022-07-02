import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1656766980962 implements MigrationInterface {
  name = 'migration1656766980962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."acl_abilities_type_enum" AS ENUM('can', 'cannot')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acl_abilities_action_enum" AS ENUM(
                'manage',
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
                "password" character varying(100) NOT NULL,
                "password_expired" TIMESTAMP NOT NULL,
                "salt" character varying(100) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT false,
                "email_verified" boolean NOT NULL DEFAULT false,
                "email_verification_token" character varying,
                "role_id" uuid,
                "organization_id" uuid,
                CONSTRAINT "uq_users_mobile_number" UNIQUE ("mobile_number"),
                CONSTRAINT "uq_users_email" UNIQUE ("email"),
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
            ALTER TABLE "acl_abilities"
            ADD CONSTRAINT "fk_acl_abilities_subject_id" FOREIGN KEY ("subject_id") REFERENCES "acl_subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_subjects"
            ADD CONSTRAINT "fk_acl_subjects_policy_id" FOREIGN KEY ("policy_id") REFERENCES "acl_policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "acl_role_presets"
            ADD CONSTRAINT "fk_acl_role_presets_policy_id" FOREIGN KEY ("policy_id") REFERENCES "acl_policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "acl_role_presets" DROP CONSTRAINT "fk_acl_role_presets_policy_id"
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
            ALTER TABLE "acl_subjects" DROP CONSTRAINT "fk_acl_subjects_policy_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities" DROP CONSTRAINT "fk_acl_abilities_subject_id"
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
  }
}
