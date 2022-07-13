import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1657712156252 implements MigrationInterface {
  name = 'migration1657712156252';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_mobile_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
                RENAME COLUMN "mobile_number" TO "phone_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
                RENAME CONSTRAINT "uq_users_mobile_number" TO "uq_users_phone_number"
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_phone_number" ON "users" ("phone_number")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_users_phone_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
                RENAME CONSTRAINT "uq_users_phone_number" TO "uq_users_mobile_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
                RENAME COLUMN "phone_number" TO "mobile_number"
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_users_mobile_number" ON "users" ("mobile_number")
        `);
  }
}
