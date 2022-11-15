import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1665493242691 implements MigrationInterface {
  name = 'migration1665493242691';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD "phone_verified_at" TIMESTAMP
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP COLUMN "phone_verified_at"
        `);
  }
}
