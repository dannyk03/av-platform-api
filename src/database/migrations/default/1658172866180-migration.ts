import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658172866180 implements MigrationInterface {
  name = 'migration1658172866180';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_images"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_displa"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_sign_up_email_verification_links_sign_up_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_displ"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_image"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
                RENAME COLUMN "sign_up_code" TO "code"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
                RENAME CONSTRAINT "uq_sign_up_email_verification_links_sign_up_code" TO "uq_sign_up_email_verification_links_code"
        `);
    await queryRunner.query(`
            CREATE TABLE "organization_invite_links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "email" character varying(50) NOT NULL,
                "code" character varying(32) NOT NULL,
                "used_at" TIMESTAMP,
                "expires_at" TIMESTAMP,
                "role_id" uuid,
                "organization_id" uuid,
                CONSTRAINT "uq_organization_invite_links_email" UNIQUE ("email"),
                CONSTRAINT "uq_organization_invite_links_code" UNIQUE ("code"),
                CONSTRAINT "pk_organization_invite_links_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_organization_invite_links_email" ON "organization_invite_links" ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_organization_invite_links_code" ON "organization_invite_links" ("code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_sign_up_email_verification_links_code" ON "sign_up_email_verification_links" ("code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_display_options_id" ON "product_display_options_images_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_images_id" ON "product_display_options_images_product_images" ("product_images_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links"
            ADD CONSTRAINT "fk_organization_invite_links_role_id" FOREIGN KEY ("role_id") REFERENCES "acl_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links"
            ADD CONSTRAINT "fk_organization_invite_links_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images"
            ADD CONSTRAINT "fk_product_display_options_images_product_images_product_display_options_id" FOREIGN KEY ("product_display_options_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images"
            ADD CONSTRAINT "fk_product_display_options_images_product_images_product_images_id" FOREIGN KEY ("product_images_id") REFERENCES "product_images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_images_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images" DROP CONSTRAINT "fk_product_display_options_images_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links" DROP CONSTRAINT "fk_organization_invite_links_organization_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links" DROP CONSTRAINT "fk_organization_invite_links_role_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_images_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_display_options_images_product_images_product_display_options_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_sign_up_email_verification_links_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_organization_invite_links_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_organization_invite_links_email"
        `);
    await queryRunner.query(`
            DROP TABLE "organization_invite_links"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
                RENAME CONSTRAINT "uq_sign_up_email_verification_links_code" TO "uq_sign_up_email_verification_links_sign_up_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "sign_up_email_verification_links"
                RENAME COLUMN "code" TO "sign_up_code"
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_image" ON "product_display_options_images_product_images" ("product_images_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_product_display_options_images_product_images_product_displ" ON "product_display_options_images_product_images" ("product_display_options_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_sign_up_email_verification_links_sign_up_code" ON "sign_up_email_verification_links" ("sign_up_code")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images"
            ADD CONSTRAINT "fk_product_display_options_images_product_images_product_displa" FOREIGN KEY ("product_display_options_id") REFERENCES "product_display_options"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options_images_product_images"
            ADD CONSTRAINT "fk_product_display_options_images_product_images_product_images" FOREIGN KEY ("product_images_id") REFERENCES "product_images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
