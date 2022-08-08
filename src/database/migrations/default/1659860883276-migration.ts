import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1659860883276 implements MigrationInterface {
  name = 'migration1659860883276';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs"
                RENAME COLUMN "bodies" TO "body"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs"
                RENAME COLUMN "body" TO "bodies"
        `);
  }
}
