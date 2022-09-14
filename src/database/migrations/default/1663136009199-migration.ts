import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1663136009199 implements MigrationInterface {
  name = 'migration1663136009199';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests" DROP CONSTRAINT "fk_social_connection_requests_addressed_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests"
                RENAME COLUMN "addressed_user_id" TO "addresser_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests"
            ADD CONSTRAINT "fk_social_connection_requests_addresser_user_id" FOREIGN KEY ("addresser_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests" DROP CONSTRAINT "fk_social_connection_requests_addresser_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests"
                RENAME COLUMN "addresser_user_id" TO "addressed_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests"
            ADD CONSTRAINT "fk_social_connection_requests_addressed_user_id" FOREIGN KEY ("addressed_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }
}
