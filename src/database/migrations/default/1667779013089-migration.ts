import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667779013089 implements MigrationInterface {
  name = 'migration1667779013089';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "stripe_webhook_events" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "pk_stripe_webhook_events_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders"
            ADD "payment_status" character varying(255)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_orders" DROP COLUMN "payment_status"
        `);
    await queryRunner.query(`
            DROP TABLE "stripe_webhook_events"
        `);
  }
}
