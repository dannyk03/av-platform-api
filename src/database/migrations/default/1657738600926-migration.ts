import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1657738600926 implements MigrationInterface {
  name = 'migration1657738600926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_sends" DROP COLUMN "status"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."gift_sends_status_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_sends"
            ADD "accepted_at" TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_sends"
            ADD "approved_at" TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_sends"
            ADD "shipped_at" TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_sends"
            ADD "delivered_at" TIMESTAMP
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_gift_sends_recipient_email"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_sends" DROP COLUMN "recipient_email"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_sends"
            ADD "recipient_email" character varying(30) NOT NULL
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_gift_sends_recipient_email" ON "gift_sends" ("recipient_email")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_gift_sends_recipient_email"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_sends" DROP COLUMN "recipient_email"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_sends"
            ADD "recipient_email" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_gift_sends_recipient_email" ON "gift_sends" ("recipient_email")
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_sends" DROP COLUMN "delivered_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_sends" DROP COLUMN "shipped_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_sends" DROP COLUMN "approved_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_sends" DROP COLUMN "accepted_at"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."gift_sends_status_enum" AS ENUM(
                'New',
                'PendingRecipientSubmit',
                'PendingSenderSubmit',
                'Submitted',
                'InDelivery',
                'Delivered'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_sends"
            ADD "status" "public"."gift_sends_status_enum" NOT NULL DEFAULT 'New'
        `);
  }
}
