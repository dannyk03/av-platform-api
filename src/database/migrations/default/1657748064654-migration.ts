import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1657748064654 implements MigrationInterface {
  name = 'migration1657748064654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "acl_roles" DROP CONSTRAINT "uq_role_organization"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "uq_product_display_option_language"
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
                'Product',
                'OrganizationNamespace',
                'SecurityNamespace',
                'FinanceNamespace',
                'GiftingNamespace',
                'CatalogNamespace'
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
            ALTER TABLE "acl_roles"
            ADD CONSTRAINT "uq_acl_roles_name_organization_id_slug" UNIQUE ("slug", "name", "organization_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "uq_product_display_options_language_iso_code_product_id" UNIQUE ("language_iso_code", "product_id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options" DROP CONSTRAINT "uq_product_display_options_language_iso_code_product_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles" DROP CONSTRAINT "uq_acl_roles_name_organization_id_slug"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acl_subjects_type_enum_old" AS ENUM(
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
            ALTER TABLE "product_display_options"
            ADD CONSTRAINT "uq_product_display_option_language" UNIQUE ("language_iso_code", "product_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_roles"
            ADD CONSTRAINT "uq_role_organization" UNIQUE ("slug", "name", "organization_id")
        `);
  }
}
