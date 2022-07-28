import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658948289450 implements MigrationInterface {
  name = 'migration1658948289450';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs"
            ALTER COLUMN "version" DROP NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
  }
}
