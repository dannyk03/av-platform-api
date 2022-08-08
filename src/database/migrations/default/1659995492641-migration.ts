import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1659995492641 implements MigrationInterface {
  name = 'migration1659995492641';

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
            ADD CONSTRAINT "fk_gift_orders_gift_intent_id" FOREIGN KEY ("gift_intent_id") REFERENCES "gift_intents"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_options" DROP CONSTRAINT "fk_gift_options_gift_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_options" DROP CONSTRAINT "fk_gift_options_gift_intent_id"
    `);
    await queryRunner.query(`
            DROP TABLE "gift_options"
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
