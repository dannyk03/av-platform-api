import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667484781816 implements MigrationInterface {
  name = 'migration1667484781816';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "purchase_cost" numeric(10, 2) NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "shipping_time_in_days" integer
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "shipping_time_in_days"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "purchase_cost"
        `);
  }
}
