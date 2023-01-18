import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1673952203184 implements MigrationInterface {
  name = 'migration1673952203184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "groups"
            ALTER COLUMN "code"
            SET NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "groups"
            ALTER COLUMN "code" DROP NOT NULL
        `);
  }
}
