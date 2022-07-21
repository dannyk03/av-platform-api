import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658393541703 implements MigrationInterface {
  name = 'migration1658393541703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP CONSTRAINT "uq_product_images_file_name"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD CONSTRAINT "uq_product_images_file_name" UNIQUE ("file_name")
        `);
  }
}
