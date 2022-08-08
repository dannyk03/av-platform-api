import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1659785569817 implements MigrationInterface {
  name = 'migration1659785569817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_orders" DROP CONSTRAINT "fk_gift_orders_gift_intent_id"
        `);
    await queryRunner.query(`
            CREATE TABLE "vendors" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(30) NOT NULL,
                "slug" character varying(30) NOT NULL,
                CONSTRAINT "uq_vendors_name" UNIQUE ("name"),
                CONSTRAINT "uq_vendors_slug" UNIQUE ("slug"),
                CONSTRAINT "pk_vendors_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_vendors_name" ON "vendors" ("name")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_vendors_slug" ON "vendors" ("slug")
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders" DROP COLUMN "gift_intent_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "price" numeric(10, 2) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "vendor_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "currency_code" character varying(4)
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
            ALTER TABLE "products"
            ADD CONSTRAINT "fk_products_vendor_id" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "fk_products_currency_code" FOREIGN KEY ("currency_code") REFERENCES "currencies"("code") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "fk_products_currency_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "fk_products_vendor_id"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."acl_subjects_type_enum_old" AS ENUM(
                'Ability',
                'CatalogNamespace',
                'CreditCard',
                'FinanceNamespace',
                'Gift',
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
            ALTER TABLE "products" DROP COLUMN "currency_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "vendor_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "price"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders"
            ADD "gift_intent_id" uuid
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_vendors_slug"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_vendors_name"
        `);
    await queryRunner.query(`
            DROP TABLE "vendors"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders"
            ADD CONSTRAINT "fk_gift_orders_gift_intent_id" FOREIGN KEY ("gift_intent_id") REFERENCES "gift_intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
