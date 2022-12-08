import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1670445303880 implements MigrationInterface {
  name = 'migration1670445303880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests"
            ALTER COLUMN "temp_addressee_email" TYPE character varying(100)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests"
            ALTER COLUMN "temp_addressee_email" TYPE character varying(30)
        `);
  }
}
