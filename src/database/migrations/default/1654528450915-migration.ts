import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1654528450915 implements MigrationInterface {
  name = 'migration1654528450915';

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
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "pk_loggers_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "permissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "slug" character varying NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "description" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
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
                "slug" character varying NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
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
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "mobile_number" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "password_expired" TIMESTAMP NOT NULL,
                "salt" character varying NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
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
                "roleId" uuid NOT NULL,
                "permissionId" uuid NOT NULL,
                CONSTRAINT "pk_role_permission_permissionId_roleId" PRIMARY KEY ("roleId", "permissionId")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_role_permission_roleId" ON "role_permission" ("roleId")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_role_permission_permissionId" ON "role_permission" ("permissionId")
        `);
    await queryRunner.query(`
            ALTER TABLE "role_permission"
            ADD CONSTRAINT "fk_role_permission_roleId" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "role_permission"
            ADD CONSTRAINT "fk_role_permission_permissionId" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "role_permission" DROP CONSTRAINT "fk_role_permission_permissionId"
        `);
    await queryRunner.query(`
            ALTER TABLE "role_permission" DROP CONSTRAINT "fk_role_permission_roleId"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_role_permission_permissionId"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_role_permission_roleId"
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
