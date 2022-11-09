import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667974032316 implements MigrationInterface {
  name = 'migration1667974032316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                ALTER TABLE "product_images"
                ALTER COLUMN "file_name" TYPE character varying(40)
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                ALTER TABLE "product_images"
                ALTER COLUMN "file_name" TYPE character varying(30)
            `);
  }
}
