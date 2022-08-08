import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1659514757988 implements MigrationInterface {
  name = 'migration1659514757988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_intents" DROP CONSTRAINT "fk_gift_intents_gift_id"
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "gift_intent_id" uuid,
                CONSTRAINT "pk_gift_orders_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents" DROP CONSTRAINT "rel_gift_intents_gift_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents" DROP COLUMN "gift_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD "order_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders"
            ADD CONSTRAINT "fk_gift_orders_gift_intent_id" FOREIGN KEY ("gift_intent_id") REFERENCES "gift_intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_order_id" FOREIGN KEY ("order_id") REFERENCES "gifts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_order_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders" DROP CONSTRAINT "fk_gift_orders_gift_intent_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP COLUMN "order_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents"
            ADD "gift_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents"
            ADD CONSTRAINT "rel_gift_intents_gift_id" UNIQUE ("gift_id")
        `);
    await queryRunner.query(`
            DROP TABLE "gift_orders"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents"
            ADD CONSTRAINT "fk_gift_intents_gift_id" FOREIGN KEY ("gift_id") REFERENCES "gifts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
