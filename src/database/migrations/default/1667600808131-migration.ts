import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667600808131 implements MigrationInterface {
  name = 'migration1667600808131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ALTER COLUMN "public_id"
            SET NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ALTER COLUMN "public_id" DROP NOT NULL
        `);
  }
}
