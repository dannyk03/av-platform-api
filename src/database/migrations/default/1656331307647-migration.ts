import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1656331307647 implements MigrationInterface {
  name = 'migration1656331307647';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "jwt_refresh_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "description" character varying,
                "key" character varying NOT NULL,
                "hash" character varying NOT NULL,
                "encryption_key" character varying NOT NULL,
                "passphrase" character varying NOT NULL,
                "is_active" boolean NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "uq_jwt_refresh_tokens_key" UNIQUE ("key"),
                CONSTRAINT "pk_jwt_refresh_tokens_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acl_abilities_type_enum" AS ENUM('can', 'cannot')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acl_abilities_actions_enum" AS ENUM(
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
                "actions" "public"."acl_abilities_actions_enum" array NOT NULL,
                "fields_access" character varying(20) array,
                "conditions" jsonb,
                "subject_id" uuid,
                CONSTRAINT "pk_acl_abilities_id" PRIMARY KEY ("id")
            )
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
                "sensitivity_level" integer NOT NULL DEFAULT '1',
                "type" "public"."acl_subjects_type_enum" NOT NULL,
                "policy_id" uuid,
                CONSTRAINT "sensitivity_level" CHECK (
                    sensitivity_level BETWEEN 1 AND 10
                ),
                CONSTRAINT "pk_acl_subjects_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "acl_policies" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "sensitivity_level" smallint NOT NULL DEFAULT '1',
                CONSTRAINT "sensitivity_level" CHECK (
                    sensitivity_level BETWEEN 1 AND 10
                ),
                CONSTRAINT "pk_acl_policies_id" PRIMARY KEY ("id")
            )
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
            CREATE INDEX "role_slug_index" ON "acl_roles" ("slug")
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
            CREATE INDEX "user_mobile_index" ON "users" ("mobile_number")
        `);
    await queryRunner.query(`
            CREATE INDEX "user_email_index" ON "users" ("email")
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
            CREATE INDEX "role_preset_slug_index" ON "acl_role_presets" ("slug")
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
            ALTER TABLE "acl_roles"
            ADD CONSTRAINT "fk_acl_roles_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles"
            ADD CONSTRAINT "fk_acl_roles_policy_id" FOREIGN KEY ("policy_id") REFERENCES "acl_policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_organization_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_role_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles" DROP CONSTRAINT "fk_acl_roles_policy_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles" DROP CONSTRAINT "fk_acl_roles_organization_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_subjects" DROP CONSTRAINT "fk_acl_subjects_policy_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities" DROP CONSTRAINT "fk_acl_abilities_subject_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."role_preset_slug_index"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_role_presets"
        `);
    await queryRunner.query(`
            DROP TABLE "logs"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."user_email_index"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."user_mobile_index"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
    await queryRunner.query(`
            DROP TABLE "organizations"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."role_slug_index"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_roles"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_policies"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_subjects"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acl_subjects_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "acl_abilities"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acl_abilities_actions_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acl_abilities_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "jwt_refresh_tokens"
        `);
  }
}
