import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667420169332 implements MigrationInterface {
  name = 'migration1667420169332';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."product_images_malware_detection_status_enum" AS ENUM('pending', 'approved', 'rejected')
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "malware_detection_status" "public"."product_images_malware_detection_status_enum" NOT NULL DEFAULT 'pending'
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
                'SocialConnection',
                'OrganizationNamespace',
                'SecurityNamespace',
                'FinanceNamespace',
                'GiftingNamespace',
                'CatalogNamespace',
                'ProductNamespace',
                'NetworkingNamespace'
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
                'OrganizationMember',
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
            ALTER TABLE "product_images" DROP COLUMN "malware_detection_status"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."product_images_malware_detection_status_enum"
        `);
  }
}
