import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1659968071543 implements MigrationInterface {
  name = 'migration1659968071543';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "fk_products_vendor_id"
        `);
    await queryRunner.query(`
            CREATE TABLE "vendor_logos" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "file_name" character varying(30) NOT NULL,
                "asset_id" character varying(32) NOT NULL,
                "public_id" character varying(100) NOT NULL,
                "secure_url" character varying(200) NOT NULL,
                CONSTRAINT "uq_vendor_logos_asset_id" UNIQUE ("asset_id"),
                CONSTRAINT "uq_vendor_logos_public_id" UNIQUE ("public_id"),
                CONSTRAINT "uq_vendor_logos_secure_url" UNIQUE ("secure_url"),
                CONSTRAINT "pk_vendor_logos_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_vendor_logos_file_name" ON "vendor_logos" ("file_name")
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors"
            ADD "description" character varying(200) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors"
            ADD "is_active" boolean NOT NULL DEFAULT true
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors"
            ADD "logo_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors"
            ADD CONSTRAINT "uq_vendors_logo_id" UNIQUE ("logo_id")
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
                'GiftIntent',
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
    await queryRunner.query(`
            CREATE INDEX "idx_vendors_description" ON "vendors" ("description")
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors"
            ADD CONSTRAINT "fk_vendors_logo_id" FOREIGN KEY ("logo_id") REFERENCES "vendor_logos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "fk_products_vendor_id" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "fk_products_vendor_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors" DROP CONSTRAINT "fk_vendors_logo_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_vendors_description"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acl_subjects_type_enum_old" AS ENUM(
                'Ability',
                'CatalogNamespace',
                'CreditCard',
                'FinanceNamespace',
                'Gift',
                'GiftIntent',
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
                'User'
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
            ALTER TABLE "vendors" DROP CONSTRAINT "uq_vendors_logo_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors" DROP COLUMN "logo_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors" DROP COLUMN "is_active"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors" DROP COLUMN "description"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_vendor_logos_file_name"
        `);
    await queryRunner.query(`
            DROP TABLE "vendor_logos"
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "fk_products_vendor_id" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
