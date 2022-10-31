import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667138993537 implements MigrationInterface {
  name = 'migration1667138993537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_orders" DROP CONSTRAINT "fk_gift_orders_gift_intent_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders"
            ADD "stripe_payment_intent_id" character varying(255)
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders"
            ADD CONSTRAINT "fk_gift_orders_gift_intent_id" FOREIGN KEY ("gift_intent_id") REFERENCES "gift_intents"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_orders" DROP CONSTRAINT "fk_gift_orders_gift_intent_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders" DROP COLUMN "stripe_payment_intent_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders"
            ADD CONSTRAINT "fk_gift_orders_gift_intent_id" FOREIGN KEY ("gift_intent_id") REFERENCES "gift_intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
