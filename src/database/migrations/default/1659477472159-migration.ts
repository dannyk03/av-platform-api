import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1659477472159 implements MigrationInterface {
  name = 'migration1659477472159';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_confirmation_link_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_additional_data_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_sender_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_recipient_id"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."gift_intent_additional_datas_occasion_enum" AS ENUM(
                'ThankYou',
                'MakeASmile',
                'Birthday',
                'Wedding',
                'WeddingAnniversary',
                'WorkAnniversary',
                'Housewarming',
                'Birth',
                'Graduation',
                'BabyShowers',
                'Engagement'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_intent_additional_datas" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "price_max" integer NOT NULL,
                "price_min" integer NOT NULL,
                "occasion" "public"."gift_intent_additional_datas_occasion_enum" NOT NULL,
                "currency_code" character varying(4),
                CONSTRAINT "pk_gift_intent_additional_datas_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_intent_confirmation_links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "code" character varying(21) NOT NULL,
                "used_at" TIMESTAMP,
                "expires_at" TIMESTAMP,
                CONSTRAINT "uq_gift_intent_confirmation_links_code" UNIQUE ("code"),
                CONSTRAINT "pk_gift_intent_confirmation_links_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_gift_intent_confirmation_links_code" ON "gift_intent_confirmation_links" ("code")
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_intents" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "sent_at" TIMESTAMP,
                "accepted_at" TIMESTAMP,
                "approved_at" TIMESTAMP,
                "shipped_at" TIMESTAMP,
                "delivered_at" TIMESTAMP,
                "recipient_id" uuid,
                "sender_id" uuid,
                "additional_data_id" uuid,
                "confirmation_link_id" uuid,
                "gift_id" uuid,
                CONSTRAINT "rel_gift_intents_recipient_id" UNIQUE ("recipient_id"),
                CONSTRAINT "rel_gift_intents_sender_id" UNIQUE ("sender_id"),
                CONSTRAINT "rel_gift_intents_additional_data_id" UNIQUE ("additional_data_id"),
                CONSTRAINT "rel_gift_intents_gift_id" UNIQUE ("gift_id"),
                CONSTRAINT "pk_gift_intents_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_options" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "gift_intent_id" uuid,
                "gift_id" uuid,
                CONSTRAINT "pk_gift_options_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP COLUMN "sent_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP COLUMN "accepted_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP COLUMN "approved_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP COLUMN "shipped_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP COLUMN "delivered_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "rel_gifts_recipient_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP COLUMN "recipient_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "rel_gifts_sender_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP COLUMN "sender_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "rel_gifts_additional_data_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP COLUMN "additional_data_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP COLUMN "confirmation_link_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD "gift_intent_id" uuid
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
            ALTER TABLE "gift_intent_additional_datas"
            ADD CONSTRAINT "fk_gift_intent_additional_datas_currency_code" FOREIGN KEY ("currency_code") REFERENCES "currencies"("code") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_gift_intent_id" FOREIGN KEY ("gift_intent_id") REFERENCES "gift_intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents"
            ADD CONSTRAINT "fk_gift_intents_recipient_id" FOREIGN KEY ("recipient_id") REFERENCES "gift_recipients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents"
            ADD CONSTRAINT "fk_gift_intents_sender_id" FOREIGN KEY ("sender_id") REFERENCES "gift_senders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents"
            ADD CONSTRAINT "fk_gift_intents_additional_data_id" FOREIGN KEY ("additional_data_id") REFERENCES "gift_intent_additional_datas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents"
            ADD CONSTRAINT "fk_gift_intents_confirmation_link_id" FOREIGN KEY ("confirmation_link_id") REFERENCES "gift_intent_confirmation_links"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents"
            ADD CONSTRAINT "fk_gift_intents_gift_id" FOREIGN KEY ("gift_id") REFERENCES "gifts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_options"
            ADD CONSTRAINT "fk_gift_options_gift_intent_id" FOREIGN KEY ("gift_intent_id") REFERENCES "gift_intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_options"
            ADD CONSTRAINT "fk_gift_options_gift_id" FOREIGN KEY ("gift_id") REFERENCES "gifts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_additional_datas" DROP CONSTRAINT "fk_gift_additional_datas_currency_code"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_additional_datas"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_send_confirmation_links"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_options" DROP CONSTRAINT "fk_gift_options_gift_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_options" DROP CONSTRAINT "fk_gift_options_gift_intent_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents" DROP CONSTRAINT "fk_gift_intents_gift_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents" DROP CONSTRAINT "fk_gift_intents_confirmation_link_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents" DROP CONSTRAINT "fk_gift_intents_additional_data_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents" DROP CONSTRAINT "fk_gift_intents_sender_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents" DROP CONSTRAINT "fk_gift_intents_recipient_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_gift_intent_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intent_additional_datas" DROP CONSTRAINT "fk_gift_intent_additional_datas_currency_code"
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
            ALTER TABLE "gifts" DROP COLUMN "gift_intent_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD "confirmation_link_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD "additional_data_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "rel_gifts_additional_data_id" UNIQUE ("additional_data_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD "sender_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "rel_gifts_sender_id" UNIQUE ("sender_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD "recipient_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "rel_gifts_recipient_id" UNIQUE ("recipient_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD "delivered_at" TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD "shipped_at" TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD "approved_at" TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD "accepted_at" TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD "sent_at" TIMESTAMP
        `);
    await queryRunner.query(`
            DROP TABLE "gift_options"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_intents"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_gift_intent_confirmation_links_code"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_intent_confirmation_links"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_intent_additional_datas"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."gift_intent_additional_datas_occasion_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_recipient_id" FOREIGN KEY ("recipient_id") REFERENCES "gift_recipients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_sender_id" FOREIGN KEY ("sender_id") REFERENCES "gift_senders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_additional_data_id" FOREIGN KEY ("additional_data_id") REFERENCES "gift_additional_datas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_confirmation_link_id" FOREIGN KEY ("confirmation_link_id") REFERENCES "gift_send_confirmation_links"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
