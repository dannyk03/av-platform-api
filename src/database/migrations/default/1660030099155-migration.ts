import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1660030099155 implements MigrationInterface {
  name = 'migration1660030099155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_order_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
                RENAME COLUMN "order_id" TO "gift_select_id"
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_selects" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "gift_intent_id" uuid,
                CONSTRAINT "rel_gift_selects_gift_intent_id" UNIQUE ("gift_intent_id"),
                CONSTRAINT "pk_gift_selects_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_gift_select_id" FOREIGN KEY ("gift_select_id") REFERENCES "gift_selects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_selects"
            ADD CONSTRAINT "fk_gift_selects_gift_intent_id" FOREIGN KEY ("gift_intent_id") REFERENCES "gift_intents"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
        DROP TABLE "gift_orders"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_selects" DROP CONSTRAINT "fk_gift_selects_gift_intent_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_gift_select_id"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_selects"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
                RENAME COLUMN "gift_select_id" TO "order_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_order_id" FOREIGN KEY ("order_id") REFERENCES "gifts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
