import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667924933449 implements MigrationInterface {
  name = 'migration1667924933449';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs"
            ALTER COLUMN "description" DROP NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs"
            ALTER COLUMN "description"
            SET NOT NULL
        `);
  }
}
