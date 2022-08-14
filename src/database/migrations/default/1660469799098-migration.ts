import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1660469799098 implements MigrationInterface {
  name = 'migration1660469799098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ADD "weight" smallint NOT NULL DEFAULT '0'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_images" DROP COLUMN "weight"
        `);
  }
}
