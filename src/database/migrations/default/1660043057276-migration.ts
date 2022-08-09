import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1660043057276 implements MigrationInterface {
  name = 'migration1660043057276';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_gift_select_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
                RENAME COLUMN "gift_select_id" TO "gift_submit_id"
        `);
    await queryRunner.query(`
            CREATE TABLE "gift_submits" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "gift_intent_id" uuid,
                CONSTRAINT "rel_gift_submits_gift_intent_id" UNIQUE ("gift_intent_id"),
                CONSTRAINT "pk_gift_submits_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents" DROP COLUMN "approved_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents"
            ADD "ready_at" TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents"
            ADD "submitted_at" TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_gift_submit_id" FOREIGN KEY ("gift_submit_id") REFERENCES "gift_submits"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_submits"
            ADD CONSTRAINT "fk_gift_submits_gift_intent_id" FOREIGN KEY ("gift_intent_id") REFERENCES "gift_intents"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            DROP TABLE IF EXISTS "gift_selects"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_submits" DROP CONSTRAINT "fk_gift_submits_gift_intent_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts" DROP CONSTRAINT "fk_gifts_gift_submit_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents" DROP COLUMN "submitted_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents" DROP COLUMN "ready_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents"
            ADD "approved_at" TIMESTAMP
        `);
    await queryRunner.query(`
            DROP TABLE "gift_submits"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
                RENAME COLUMN "gift_submit_id" TO "gift_select_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ADD CONSTRAINT "fk_gifts_gift_select_id" FOREIGN KEY ("gift_select_id") REFERENCES "gift_selects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
