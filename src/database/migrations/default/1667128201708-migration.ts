import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667128201708 implements MigrationInterface {
  name = 'migration1667128201708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_orders"
            ADD "gift_intent_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders"
            ADD CONSTRAINT "uq_gift_orders_gift_intent_id" UNIQUE ("gift_intent_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders"
            ADD CONSTRAINT "fk_gift_orders_gift_intent_id" FOREIGN KEY ("gift_intent_id") REFERENCES "gift_intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_orders" DROP CONSTRAINT "fk_gift_orders_gift_intent_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders" DROP CONSTRAINT "uq_gift_orders_gift_intent_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders" DROP COLUMN "gift_intent_id"
        `);
  }
}
