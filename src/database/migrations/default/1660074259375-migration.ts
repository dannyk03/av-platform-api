import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1660074259375 implements MigrationInterface {
  name = 'migration1660074259375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "gift_intent_ready_links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "code" character varying(21) NOT NULL,
                "used_at" TIMESTAMP,
                "expires_at" TIMESTAMP,
                "gift_intent_id" uuid,
                CONSTRAINT "uq_gift_intent_ready_links_code" UNIQUE ("code"),
                CONSTRAINT "rel_gift_intent_ready_links_gift_intent_id" UNIQUE ("gift_intent_id"),
                CONSTRAINT "pk_gift_intent_ready_links_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_gift_intent_ready_links_code" ON "gift_intent_ready_links" ("code")
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intent_ready_links"
            ADD CONSTRAINT "fk_gift_intent_ready_links_gift_intent_id" FOREIGN KEY ("gift_intent_id") REFERENCES "gift_intents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_intent_ready_links" DROP CONSTRAINT "fk_gift_intent_ready_links_gift_intent_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_gift_intent_ready_links_code"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_intent_ready_links"
        `);
  }
}
