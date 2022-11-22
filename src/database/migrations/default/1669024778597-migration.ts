import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1669024778597 implements MigrationInterface {
  name = 'migration1669024778597';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings"
            ADD "delivery_instructions" character varying(1000)
        `);
    await queryRunner.query(`
             DROP TABLE IF EXISTS "user_profile_mailings"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings" DROP COLUMN "delivery_instructions"
        `);
  }
}
