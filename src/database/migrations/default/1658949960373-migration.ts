import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658949960373 implements MigrationInterface {
  name = 'migration1658949960373';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_asset_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "asset_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "asset_id" character varying(32) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_asset_id" UNIQUE ("asset_id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_asset_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "asset_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "asset_id" character varying(16) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_asset_id" UNIQUE ("asset_id")
        `);
  }
}
