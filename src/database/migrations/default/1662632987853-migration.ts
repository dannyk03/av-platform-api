import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1662632987853 implements MigrationInterface {
  name = 'migration1662632987853';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "birth_month" character varying(2)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "birth_day" character varying(2)
        `);
    await queryRunner.query(`
        ALTER TABLE "user_profiles"
        ADD "work_anniversary_year" character varying(4)
    `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "work_anniversary_month" character varying(2)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "work_anniversary_day" character varying(2)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "kid_friendly_activities" jsonb
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
                'OrganizationMember',
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
                'GiftIntent',
                'GiftOption',
                'GiftOrder',
                'Product',
                'ProductDisplayOption',
                'ProductImage',
                'Vendor',
                'OrganizationNamespace',
                'SecurityNamespace',
                'FinanceNamespace',
                'GiftingNamespace',
                'CatalogNamespace',
                'ProductNamespace'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "acl_subjects"
            ALTER COLUMN "type" TYPE "public"."acl_subjects_type_enum" USING "type"::"text"::"public"."acl_subjects_type_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."acl_subjects_type_enum_old"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."acl_subjects_type_enum_old" AS ENUM(
                'Ability',
                'CatalogNamespace',
                'CreditCard',
                'FinanceNamespace',
                'Gift',
                'GiftIntent',
                'GiftOption',
                'GiftOrder',
                'GiftingNamespace',
                'Invoice',
                'Order',
                'Organization',
                'OrganizationInvite',
                'OrganizationNamespace',
                'Payment',
                'Policy',
                'Product',
                'ProductDisplayOption',
                'ProductImage',
                'ProductNamespace',
                'Role',
                'SecurityNamespace',
                'Subject',
                'System',
                'User',
                'Vendor'
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
            ALTER TABLE "user_profiles" DROP COLUMN "kid_friendly_activities"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "work_anniversary_day"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "work_anniversary_month"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "work_anniversary_year"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "birth_day"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "birth_month"
        `);
  }
}
