import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1663062812609 implements MigrationInterface {
  name = 'migration1663062812609';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "forgot_password_links"
            ADD "user_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "forgot_password_links"
            ADD CONSTRAINT "fk_forgot_password_links_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "forgot_password_links" DROP CONSTRAINT "fk_forgot_password_links_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "forgot_password_links" DROP COLUMN "user_id"
        `);
  }
}
