import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667907097946 implements MigrationInterface {
  name = 'migration1667907097946';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_products_sku"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "uq_products_sku"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "sku"
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "sku" character varying(40) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "uq_products_sku" UNIQUE ("sku")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_products_sku" ON "products" ("sku")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_products_sku"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "uq_products_sku"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "sku"
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "sku" character varying(30) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "uq_products_sku" UNIQUE ("sku")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_products_sku" ON "products" ("sku")
        `);
  }
}
