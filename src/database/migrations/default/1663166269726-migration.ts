import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1663166269726 implements MigrationInterface {
  name = 'migration1663166269726';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "reset_password_links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "email" character varying(50) NOT NULL,
                "code" character varying(21) NOT NULL,
                "used_at" TIMESTAMP,
                "expires_at" TIMESTAMP,
                "user_id" uuid NOT NULL,
                CONSTRAINT "uq_reset_password_links_code" UNIQUE ("code"),
                CONSTRAINT "pk_reset_password_links_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_reset_password_links_email" ON "reset_password_links" ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_reset_password_links_code" ON "reset_password_links" ("code")
        `);
    await queryRunner.query(`
            ALTER TABLE "reset_password_links"
            ADD CONSTRAINT "fk_reset_password_links_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "reset_password_links" DROP CONSTRAINT "fk_reset_password_links_user_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_reset_password_links_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_reset_password_links_email"
        `);
    await queryRunner.query(`
            DROP TABLE "reset_password_links"
        `);
  }
}
