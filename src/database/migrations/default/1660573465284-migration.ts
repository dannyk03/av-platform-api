import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1660573465284 implements MigrationInterface {
  name = 'migration1660573465284';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "fk_products_vendor_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "vendor_name" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "fk_products_vendor_id" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "fk_products_vendor_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "vendor_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "fk_products_vendor_id" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }
}
