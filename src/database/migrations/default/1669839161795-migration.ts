import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1669839161795 implements MigrationInterface {
  name = 'migration1669839161795';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "work_anniversary_year" character varying(4)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "work_anniversary_year"
        `);
  }
}
