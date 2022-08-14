import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1660481599857 implements MigrationInterface {
  name = 'migration1660481599857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_product_images_file_name"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE INDEX "idx_product_images_file_name" ON "product_images" ("file_name")
        `);
  }
}
