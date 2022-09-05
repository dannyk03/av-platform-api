import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1662388389399 implements MigrationInterface {
  name = 'migration1662388389399';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "title"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "city" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "state" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "country" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "personas" jsonb
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "dietary" jsonb
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
            ALTER TABLE "user_profiles" DROP COLUMN "dietary"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "personas"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "country"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "state"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "city"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "title" character varying(100)
        `);
  }
}
