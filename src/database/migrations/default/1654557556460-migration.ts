import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1654557556460 implements MigrationInterface {
  name = 'migration1654557556460';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
            CREATE TABLE "permissions" (
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
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
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
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
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "mobile_number" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "password_expired" TIMESTAMP NOT NULL,
                "salt" character varying NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
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
            CREATE TABLE "roles_permissions" (
                "role_id" uuid NOT NULL,
                "permission_id" uuid NOT NULL,
                CONSTRAINT "pk_roles_permissions_permission_id_role_id" PRIMARY KEY ("role_id", "permission_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_roles_permissions_role_id" ON "roles_permissions" ("role_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_roles_permissions_permission_id" ON "roles_permissions" ("permission_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "users_roles" (
                "user_id" uuid NOT NULL,
                "role_id" uuid NOT NULL,
                CONSTRAINT "pk_users_roles_role_id_user_id" PRIMARY KEY ("user_id", "role_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_roles_user_id" ON "users_roles" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_roles_role_id" ON "users_roles" ("role_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "roles_permissions"
            ADD CONSTRAINT "fk_roles_permissions_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "roles_permissions"
            ADD CONSTRAINT "fk_roles_permissions_permission_id" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "users_roles"
            ADD CONSTRAINT "fk_users_roles_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "users_roles"
            ADD CONSTRAINT "fk_users_roles_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users_roles" DROP CONSTRAINT "fk_users_roles_role_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users_roles" DROP CONSTRAINT "fk_users_roles_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "roles_permissions" DROP CONSTRAINT "fk_roles_permissions_permission_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "roles_permissions" DROP CONSTRAINT "fk_roles_permissions_role_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_roles_role_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_roles_user_id"
        `);
    await queryRunner.query(`
            DROP TABLE "users_roles"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_roles_permissions_permission_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_roles_permissions_role_id"
        `);
    await queryRunner.query(`
            DROP TABLE "roles_permissions"
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
            DROP TABLE "authapis"
        `);
    await queryRunner.query(`
            DROP TABLE "loggers"
        `);
  }
}
