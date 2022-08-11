import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1659990194571 implements MigrationInterface {
  name = 'migration1659990194571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "vendors" DROP CONSTRAINT "fk_vendors_logo_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_gift_intent_id"
        `);
    await queryRunner.query(`
            CREATE TABLE "gifts_products" (
                "gift_id" uuid NOT NULL,
                "product_id" uuid NOT NULL,
                CONSTRAINT "pk_gifts_products_gift_id_product_id" PRIMARY KEY ("gift_id", "product_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_gifts_products_gift_id" ON "gifts_products" ("gift_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_gifts_products_product_id" ON "gifts_products" ("product_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors" DROP CONSTRAINT "uq_vendors_logo_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors" DROP COLUMN "logo_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendor_logos"
            ADD "vendor_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "vendor_logos"
            ADD CONSTRAINT "uq_vendor_logos_vendor_id" UNIQUE ("vendor_id")
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
    await queryRunner.query(`
            ALTER TABLE "vendors"
            ALTER COLUMN "description" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "vendor_logos"
            ADD CONSTRAINT "fk_vendor_logos_vendor_id" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_gift_intent_id" FOREIGN KEY ("gift_intent_id") REFERENCES "gift_intents"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts_products"
            ADD CONSTRAINT "fk_gifts_products_gift_id" FOREIGN KEY ("gift_id") REFERENCES "gifts"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts_products"
            ADD CONSTRAINT "fk_gifts_products_product_id" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gifts_products" DROP CONSTRAINT "fk_gifts_products_product_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts_products" DROP CONSTRAINT "fk_gifts_products_gift_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_gift_intent_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendor_logos" DROP CONSTRAINT "fk_vendor_logos_vendor_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors"
            ALTER COLUMN "description"
            SET NOT NULL
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
            ALTER TABLE "vendor_logos" DROP CONSTRAINT "uq_vendor_logos_vendor_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendor_logos" DROP COLUMN "vendor_id"
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
            DROP INDEX "public"."idx_gifts_products_product_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_gifts_products_gift_id"
        `);
    await queryRunner.query(`
            DROP TABLE "gifts_products"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_gift_intent_id" FOREIGN KEY ("gift_intent_id") REFERENCES "gift_intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors"
            ADD CONSTRAINT "fk_vendors_logo_id" FOREIGN KEY ("logo_id") REFERENCES "vendor_logos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
