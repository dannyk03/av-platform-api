import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1669560172793 implements MigrationInterface {
  name = 'migration1669560172793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_members"
            ALTER COLUMN "role"
            SET NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_members"
            ALTER COLUMN "role" DROP NOT NULL
        `);
  }
}
