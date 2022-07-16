import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1657912752779 implements MigrationInterface {
  name = 'migration1657912752779';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images" DROP CONSTRAINT "fk_product_display_options_product_images_product_display_optio"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_product_images_product_display_opti"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD "login_code" character varying(32)
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
            ALTER TABLE "product_display_options" DROP CONSTRAINT "fk_product_display_options_language_iso_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "rel_product_display_options_language_iso_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ALTER COLUMN "password" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ALTER COLUMN "salt" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ALTER COLUMN "password_expired_at" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "is_active"
            SET DEFAULT true
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_user_auth_configs_login_code" ON "user_auth_configs" ("login_code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_product_images_product_display_options_id" ON "product_display_options_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "fk_product_display_options_language_iso_code" FOREIGN KEY ("language_iso_code") REFERENCES "display_languages"("iso_code") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images"
            ADD CONSTRAINT "fk_product_display_options_product_images_product_display_options_id" FOREIGN KEY ("product_display_options_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images" DROP CONSTRAINT "fk_product_display_options_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "fk_product_display_options_language_iso_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_user_auth_configs_login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "is_active"
            SET DEFAULT false
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ALTER COLUMN "password_expired_at"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ALTER COLUMN "salt"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ALTER COLUMN "password"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "rel_product_display_options_language_iso_code" UNIQUE ("language_iso_code")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "fk_product_display_options_language_iso_code" FOREIGN KEY ("language_iso_code") REFERENCES "display_languages"("iso_code") ON DELETE NO ACTION ON UPDATE NO ACTION
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
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_product_images_product_display_opti" ON "product_display_options_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_product_images"
            ADD CONSTRAINT "fk_product_display_options_product_images_product_display_optio" FOREIGN KEY ("product_display_options_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }
}
