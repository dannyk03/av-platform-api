import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1670491395636 implements MigrationInterface {
  name = 'migration1670491395636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "user_profiles"
        ADD "upcoming_milestones" jsonb DEFAULT '[]'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "user_profiles" DROP COLUMN "upcoming_milestones"
    `);
  }
}
