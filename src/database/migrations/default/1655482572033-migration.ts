import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1655482572033 implements MigrationInterface {
  name = 'migration1655482572033';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
            CREATE TYPE "public"."acp_abilitys_type_enum" AS ENUM('can', 'cannot')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acp_abilitys_action_enum" AS ENUM(
                'manage',
                'modify',
                'create',
                'update',
                'read',
                'delete'
            )
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
            CREATE TABLE "acp_roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "slug" character varying(20) NOT NULL,
                "name" character varying(20) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "organization_id" uuid,
                "policy_id" uuid,
                CONSTRAINT "uq_acp_roles_name_organization_id_slug" UNIQUE ("slug", "name", "organization_id"),
                CONSTRAINT "rel_acp_roles_policy_id" UNIQUE ("policy_id"),
                CONSTRAINT "pk_acp_roles_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "role_slug_index" ON "acp_roles" ("slug")
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
            ALTER TABLE "acp_abilitys"
            ADD CONSTRAINT "fk_acp_abilitys_subject_id" FOREIGN KEY ("subject_id") REFERENCES "acp_subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acp_subjects"
            ADD CONSTRAINT "fk_acp_subjects_policy_id" FOREIGN KEY ("policy_id") REFERENCES "acp_policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_role_id" FOREIGN KEY ("role_id") REFERENCES "acp_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acp_roles"
            ADD CONSTRAINT "fk_acp_roles_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "acp_roles"
            ADD CONSTRAINT "fk_acp_roles_policy_id" FOREIGN KEY ("policy_id") REFERENCES "acp_policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "acp_roles" DROP CONSTRAINT "fk_acp_roles_policy_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acp_roles" DROP CONSTRAINT "fk_acp_roles_organization_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_organization_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_role_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acp_subjects" DROP CONSTRAINT "fk_acp_subjects_policy_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acp_abilitys" DROP CONSTRAINT "fk_acp_abilitys_subject_id"
        `);
    await queryRunner.query(`
            DROP TABLE "organizations"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."role_slug_index"
        `);
    await queryRunner.query(`
            DROP TABLE "acp_roles"
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
    await queryRunner.query(`
            DROP TABLE "loggers"
        `);
    await queryRunner.query(`
            DROP TABLE "auth_apis"
        `);
  }
}
