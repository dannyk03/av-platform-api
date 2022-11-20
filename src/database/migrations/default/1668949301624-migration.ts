import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1668949301624 implements MigrationInterface {
  name = 'migration1668949301624';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "groups_users" DROP CONSTRAINT "fk_groups_users_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups_users"
            ADD CONSTRAINT "fk_groups_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "groups_users" DROP CONSTRAINT "fk_groups_users_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups_users"
            ADD CONSTRAINT "fk_groups_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
