import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1662473342784 implements MigrationInterface {
  name = 'migration1662473342784';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user_profile_homes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "city" character varying(30),
                "state" character varying(30),
                "country" character varying(30),
                "user_profile_id" uuid,
                CONSTRAINT "rel_user_profile_homes_user_profile_id" UNIQUE ("user_profile_id"),
                CONSTRAINT "pk_user_profile_homes_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user_profile_shippings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "address_line1" character varying(60),
                "address_line2" character varying(60),
                "city" character varying(30),
                "state" character varying(30),
                "zip_code" character varying(20),
                "country" character varying(30),
                "user_profile_id" uuid,
                CONSTRAINT "rel_user_profile_shippings_user_profile_id" UNIQUE ("user_profile_id"),
                CONSTRAINT "pk_user_profile_shippings_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "city"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "state"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "country"
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
            ALTER TABLE "user_profile_homes"
            ADD CONSTRAINT "fk_user_profile_homes_user_profile_id" FOREIGN KEY ("user_profile_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings"
            ADD CONSTRAINT "fk_user_profile_shippings_user_profile_id" FOREIGN KEY ("user_profile_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings" DROP CONSTRAINT "fk_user_profile_shippings_user_profile_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_homes" DROP CONSTRAINT "fk_user_profile_homes_user_profile_id"
        `);
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
            ALTER TABLE "user_profiles"
            ADD "country" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "state" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "city" character varying(30)
        `);
    await queryRunner.query(`
            DROP TABLE "user_profile_shippings"
        `);
    await queryRunner.query(`
            DROP TABLE "user_profile_homes"
        `);
  }
}
