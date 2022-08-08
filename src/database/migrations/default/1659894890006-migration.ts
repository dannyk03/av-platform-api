import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1659894890006 implements MigrationInterface {
  name = 'migration1659894890006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "shipping_cost" numeric(10, 2) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "tax_code" character varying(30) NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "tax_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "shipping_cost"
        `);
  }
}
