import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1663193147107 implements MigrationInterface {
  name = 'migration1663193147107';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP COLUMN "salt"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD "salt" character varying(100)
        `);
  }
}
