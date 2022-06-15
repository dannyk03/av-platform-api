import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1655240446525 implements MigrationInterface {
  name = 'migration1655240446525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."acp_abilitys_type_enum" AS ENUM('can', 'cannot')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acp_abilitys_action_enum" AS ENUM('manage', 'modify', 'update', 'delete', 'read')
        `);
    await queryRunner.query(`
            CREATE TABLE "acp_abilitys" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "type" "public"."acp_abilitys_type_enum" NOT NULL,
                "action" "public"."acp_abilitys_action_enum" NOT NULL,
                "fields_access" character varying array NOT NULL DEFAULT '{*}',
                "conditions" jsonb NOT NULL DEFAULT '{}',
                "subject_id" uuid,
                CONSTRAINT "pk_acp_abilitys_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acp_subjects_type_enum" AS ENUM(
                'System',
                'Organization',
                'User',
                'Policy',
                'Role',
                'Subject',
                'Ability',
                'CreditCard',
                'Invoice',
                'Order',
                'Security',
                'Finance'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "acp_subjects" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "sensitivity_level" integer NOT NULL DEFAULT '1',
                "type" "public"."acp_subjects_type_enum" NOT NULL,
                "policy_id" uuid,
                CONSTRAINT "pk_acp_subjects_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "acp_policies" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "sensitivity_level" smallint NOT NULL DEFAULT '1',
                CONSTRAINT "pk_acp_policies_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "acp_roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "slug" character varying(20) NOT NULL,
                "name" character varying(20) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "policy_id" uuid,
                CONSTRAINT "uq_acp_roles_slug" UNIQUE ("slug"),
                CONSTRAINT "uq_acp_roles_name" UNIQUE ("name"),
                CONSTRAINT "rel_acp_roles_policy_id" UNIQUE ("policy_id"),
                CONSTRAINT "pk_acp_roles_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "role_slug_index" ON "acp_roles" ("slug")
        `);
    await queryRunner.query(`
            CREATE TABLE "auth_apis" (
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
                CONSTRAINT "uq_auth_apis_key" UNIQUE ("key"),
                CONSTRAINT "pk_auth_apis_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "loggers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "level" character varying NOT NULL,
                "action" character varying NOT NULL,
                "description" character varying,
                "tags" text array NOT NULL DEFAULT '{}',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "pk_loggers_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "permissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "slug" character varying(20) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "description" character varying,
                CONSTRAINT "uq_permissions_slug" UNIQUE ("slug"),
                CONSTRAINT "pk_permissions_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "permission_slug_index" ON "permissions" ("slug")
        `);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "mobile_number" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "password_expired" TIMESTAMP NOT NULL,
                "salt" character varying NOT NULL,
                "is_active" boolean NOT NULL DEFAULT false,
                "email_verified" boolean NOT NULL DEFAULT false,
                "email_verification_token" character varying NOT NULL,
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
            CREATE TABLE "roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "pk_roles_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user_role" (
                "user_id" uuid NOT NULL,
                "role_id" uuid NOT NULL,
                CONSTRAINT "pk_user_role_role_id_user_id" PRIMARY KEY ("user_id", "role_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_user_role_user_id" ON "user_role" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_user_role_role_id" ON "user_role" ("role_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "role_permission" (
                "role_id" uuid NOT NULL,
                "permission_id" uuid NOT NULL,
                CONSTRAINT "pk_role_permission_permission_id_role_id" PRIMARY KEY ("role_id", "permission_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_role_permission_role_id" ON "role_permission" ("role_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_role_permission_permission_id" ON "role_permission" ("permission_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "acp_abilitys"
            ADD CONSTRAINT "fk_acp_abilitys_subject_id" FOREIGN KEY ("subject_id") REFERENCES "acp_subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acp_subjects"
            ADD CONSTRAINT "fk_acp_subjects_policy_id" FOREIGN KEY ("policy_id") REFERENCES "acp_policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acp_roles"
            ADD CONSTRAINT "fk_acp_roles_policy_id" FOREIGN KEY ("policy_id") REFERENCES "acp_policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_role"
            ADD CONSTRAINT "fk_user_role_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user_role"
            ADD CONSTRAINT "fk_user_role_role_id" FOREIGN KEY ("role_id") REFERENCES "acp_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "role_permission"
            ADD CONSTRAINT "fk_role_permission_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "role_permission"
            ADD CONSTRAINT "fk_role_permission_permission_id" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "role_permission" DROP CONSTRAINT "fk_role_permission_permission_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "role_permission" DROP CONSTRAINT "fk_role_permission_role_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_role" DROP CONSTRAINT "fk_user_role_role_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_role" DROP CONSTRAINT "fk_user_role_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_organization_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acp_roles" DROP CONSTRAINT "fk_acp_roles_policy_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acp_subjects" DROP CONSTRAINT "fk_acp_subjects_policy_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acp_abilitys" DROP CONSTRAINT "fk_acp_abilitys_subject_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_role_permission_permission_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_role_permission_role_id"
        `);
    await queryRunner.query(`
            DROP TABLE "role_permission"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_user_role_role_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_user_role_user_id"
        `);
    await queryRunner.query(`
            DROP TABLE "user_role"
        `);
    await queryRunner.query(`
            DROP TABLE "roles"
        `);
    await queryRunner.query(`
            DROP TABLE "organizations"
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
            DROP INDEX "public"."permission_slug_index"
        `);
    await queryRunner.query(`
            DROP TABLE "permissions"
        `);
    await queryRunner.query(`
            DROP TABLE "loggers"
        `);
    await queryRunner.query(`
            DROP TABLE "auth_apis"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."role_slug_index"
        `);
    await queryRunner.query(`
            DROP TABLE "acp_roles"
        `);
    await queryRunner.query(`
            DROP TABLE "acp_policies"
        `);
    await queryRunner.query(`
            DROP TABLE "acp_subjects"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acp_subjects_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "acp_abilitys"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acp_abilitys_action_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acp_abilitys_type_enum"
        `);
  }
}
