import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1660728934559 implements MigrationInterface {
  name = 'migration1660728934559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_user_auth_configs_login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP COLUMN "login_code_expired_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP CONSTRAINT "uq_user_auth_configs_login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP COLUMN "login_code"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD "login_code" character varying(21)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD CONSTRAINT "uq_user_auth_configs_login_code" UNIQUE ("login_code")
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD "login_code_expired_at" TIMESTAMP
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_user_auth_configs_login_code" ON "user_auth_configs" ("login_code")
        `);
  }
}
