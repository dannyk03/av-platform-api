import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1660736896091 implements MigrationInterface {
  name = 'migration1660736896091';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "friendship_requests" DROP CONSTRAINT "uq_requested_addressee_connection_request"
        `);
    await queryRunner.query(`
            ALTER TABLE "friendship_requests"
            ALTER COLUMN "status"
            SET DEFAULT 'Pending'
        `);
    await queryRunner.query(`
            ALTER TABLE "friendship_requests"
            ADD CONSTRAINT "uq_requested_addressee_connection_request" UNIQUE (
                    "requested_user_id",
                    "addressee_user_id",
                    "status"
                )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "friendship_requests" DROP CONSTRAINT "uq_requested_addressee_connection_request"
        `);
    await queryRunner.query(`
            ALTER TABLE "friendship_requests"
            ALTER COLUMN "status" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "friendship_requests"
            ADD CONSTRAINT "uq_requested_addressee_connection_request" UNIQUE (
                    "status",
                    "requested_user_id",
                    "addressee_user_id"
                )
        `);
  }
}
