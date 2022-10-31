import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1666851302396 implements MigrationInterface {
  name = 'migration1666851302396';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "stripe_payments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "customer_id" character varying(255) NOT NULL,
                "user_id" uuid,
                CONSTRAINT "uq_stripe_payments_customer_id" UNIQUE ("customer_id"),
                CONSTRAINT "rel_stripe_payments_user_id" UNIQUE ("user_id"),
                CONSTRAINT "pk_stripe_payments_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_stripe_payments_customer_id" ON "stripe_payments" ("customer_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ALTER COLUMN "match_reason" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "stripe_payments"
            ADD CONSTRAINT "fk_stripe_payments_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "stripe_payments" DROP CONSTRAINT "fk_stripe_payments_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "gifts"
            ALTER COLUMN "match_reason"
            SET NOT NULL
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_stripe_payments_customer_id"
        `);
    await queryRunner.query(`
            DROP TABLE "stripe_payments"
        `);
  }
}
