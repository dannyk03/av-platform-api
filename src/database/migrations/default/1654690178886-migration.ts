import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1654690178886 implements MigrationInterface {
  name = 'migration1654690178886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "authapis" (
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
                CONSTRAINT "uq_authapis_key" UNIQUE ("key"),
                CONSTRAINT "pk_authapis_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "loggers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "level" character varying NOT NULL,
                "action" character varying NOT NULL,
                "description" character varying,
                "tags" text array NOT NULL DEFAULT '{}',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "pk_loggers_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "permissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
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
            CREATE TABLE "roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "slug" character varying(20) NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "uq_roles_slug" UNIQUE ("slug"),
                CONSTRAINT "pk_roles_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "role_slug_index" ON "roles" ("slug")
        `);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
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
            ALTER TABLE "role_permission"
            ADD CONSTRAINT "fk_role_permission_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "role_permission"
            ADD CONSTRAINT "fk_role_permission_permission_id" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user_role"
            ADD CONSTRAINT "fk_user_role_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user_role"
            ADD CONSTRAINT "fk_user_role_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_role" DROP CONSTRAINT "fk_user_role_role_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_role" DROP CONSTRAINT "fk_user_role_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "role_permission" DROP CONSTRAINT "fk_role_permission_permission_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "role_permission" DROP CONSTRAINT "fk_role_permission_role_id"
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
            DROP INDEX "public"."idx_role_permission_permission_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_role_permission_role_id"
        `);
    await queryRunner.query(`
            DROP TABLE "role_permission"
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
            DROP INDEX "public"."role_slug_index"
        `);
    await queryRunner.query(`
            DROP TABLE "roles"
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
            DROP TABLE "authapis"
        `);
  }
}
