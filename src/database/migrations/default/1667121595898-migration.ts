import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667121595898 implements MigrationInterface {
  name = 'migration1667121595898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "gift_orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "user_id" uuid,
                CONSTRAINT "pk_gift_orders_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents"
            ADD "paid_at" TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_orders"
            ADD CONSTRAINT "fk_gift_orders_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_orders" DROP CONSTRAINT "fk_gift_orders_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intents" DROP COLUMN "paid_at"
        `);
    await queryRunner.query(`
            DROP TABLE "gift_orders"
        `);
  }
}
