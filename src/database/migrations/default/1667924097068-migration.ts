import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667924097068 implements MigrationInterface {
  name = 'migration1667924097068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ALTER COLUMN "description" TYPE character varying(1500)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_display_options"
            ALTER COLUMN "description" TYPE character varying(200)
        `);
  }
}
