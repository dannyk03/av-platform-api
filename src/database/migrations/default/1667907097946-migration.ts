import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667907097946 implements MigrationInterface {
  name = 'migration1667907097946';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "products"
            ALTER COLUMN "sku" TYPE character varying(40)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "products"
            ALTER COLUMN "sku" TYPE character varying(30)
        `);
  }
}
