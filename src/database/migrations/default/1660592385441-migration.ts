import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1660592385441 implements MigrationInterface {
  name = 'migration1660592385441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links" DROP CONSTRAINT "fk_sign_up_email_verification_links_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_profile_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_auth_config_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "rel_users_auth_config_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "auth_config_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "uq_users_profile_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "profile_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "user_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD CONSTRAINT "uq_user_profiles_user_id" UNIQUE ("user_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD "user_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD CONSTRAINT "uq_user_auth_configs_user_id" UNIQUE ("user_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links"
            ADD CONSTRAINT "uq_organization_user_role_invite" UNIQUE ("email", "role_id", "organization_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
            ADD CONSTRAINT "fk_sign_up_email_verification_links_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD CONSTRAINT "fk_user_profiles_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD CONSTRAINT "fk_user_auth_configs_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP CONSTRAINT "fk_user_auth_configs_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP CONSTRAINT "fk_user_profiles_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links" DROP CONSTRAINT "fk_sign_up_email_verification_links_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links" DROP CONSTRAINT "uq_organization_user_role_invite"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP CONSTRAINT "uq_user_auth_configs_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP COLUMN "user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP CONSTRAINT "uq_user_profiles_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "profile_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "uq_users_profile_id" UNIQUE ("profile_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "auth_config_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "rel_users_auth_config_id" UNIQUE ("auth_config_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_auth_config_id" FOREIGN KEY ("auth_config_id") REFERENCES "user_auth_configs"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_profile_id" FOREIGN KEY ("profile_id") REFERENCES "user_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
            ADD CONSTRAINT "fk_sign_up_email_verification_links_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
