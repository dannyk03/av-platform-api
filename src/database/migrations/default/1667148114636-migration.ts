import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667148114636 implements MigrationInterface {
  name = 'migration1667148114636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_orders"
            ADD CONSTRAINT "uq_gift_orders_stripe_payment_intent_id" UNIQUE ("stripe_payment_intent_id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_orders" DROP CONSTRAINT "uq_gift_orders_stripe_payment_intent_id"
        `);
  }
}
