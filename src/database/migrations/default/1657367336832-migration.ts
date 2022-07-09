import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1657367336832 implements MigrationInterface {
  name = 'migration1657367336832';

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
            ALTER TABLE "users" DROP COLUMN "password_expired"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email_verified"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "password"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "salt"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email_verification_token"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "title" character varying(100)
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "auth_config_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "uq_users_auth_config_id" UNIQUE ("auth_config_id")
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."acl_abilities_action_enum"
            RENAME TO "acl_abilities_action_enum_old"
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
            ALTER TABLE "acl_abilities"
            ALTER COLUMN "action" TYPE "public"."acl_abilities_action_enum" USING "action"::"text"::"public"."acl_abilities_action_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acl_abilities_action_enum_old"
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
                'OrganizationNamespace',
                'SecurityNamespace',
                'FinanceNamespace',
                'GiftingNamespace'
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
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_auth_config_id" FOREIGN KEY ("auth_config_id") REFERENCES "user_auth_configs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_auth_config_id"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acl_subjects_type_enum_old" AS ENUM(
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
            CREATE TYPE "public"."acl_abilities_action_enum_old" AS ENUM(
                'manage',
                'modify',
                'create',
                'update',
                'read',
                'delete'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_abilities"
            ALTER COLUMN "action" TYPE "public"."acl_abilities_action_enum_old" USING "action"::"text"::"public"."acl_abilities_action_enum_old"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acl_abilities_action_enum"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."acl_abilities_action_enum_old"
            RENAME TO "acl_abilities_action_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "uq_users_auth_config_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "auth_config_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "title"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email_verification_token" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "salt" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "password" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email_verified" boolean NOT NULL DEFAULT false
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "password_expired" TIMESTAMP NOT NULL
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_user_auth_configs_id"
        `);
    await queryRunner.query(`
            DROP TABLE "user_auth_configs"
        `);
  }
}
