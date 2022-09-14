import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1663050006652 implements MigrationInterface {
  name = 'migration1663050006652';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "forgot_password_links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "email" character varying(50) NOT NULL,
                "code" character varying(21) NOT NULL,
                "used_at" TIMESTAMP,
                "expires_at" TIMESTAMP,
                CONSTRAINT "uq_forgot_password_links_code" UNIQUE ("code"),
                CONSTRAINT "pk_forgot_password_links_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_forgot_password_links_email" ON "forgot_password_links" ("email")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_forgot_password_links_code" ON "forgot_password_links" ("code")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_forgot_password_links_code"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_forgot_password_links_email"
        `);
    await queryRunner.query(`
            DROP TABLE "forgot_password_links"
        `);
  }
}
