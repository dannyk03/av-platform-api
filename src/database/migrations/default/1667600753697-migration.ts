import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667600753697 implements MigrationInterface {
  name = 'migration1667600753697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "headers" jsonb
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_public_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "public_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "public_id" character varying(200)
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_public_id" UNIQUE ("public_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_secure_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "secure_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "secure_url" character varying(500) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_secure_url" UNIQUE ("secure_url")
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "description"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "description" character varying(1000)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "description"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "description" character varying(200) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_secure_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "secure_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "secure_url" character varying(200) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_secure_url" UNIQUE ("secure_url")
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_public_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "public_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "public_id" character varying(100) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_public_id" UNIQUE ("public_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "headers"
        `);
  }
}
