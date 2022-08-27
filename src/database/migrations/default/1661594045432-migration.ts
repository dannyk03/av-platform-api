import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1661594045432 implements MigrationInterface {
  name = 'migration1661594045432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs"
                RENAME COLUMN "original_url" TO "path"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs"
                RENAME COLUMN "path" TO "original_url"
        `);
  }
}
