import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1668975300321 implements MigrationInterface {
  name = 'migration1668975300321';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "groups" DROP CONSTRAINT "fk_groups_owner_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups" DROP COLUMN "owner_user_id"
        `);
    await queryRunner.query(`
        DROP TABLE IF EXISTS "groups_users" 
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "groups"
            ADD "owner_user_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "groups"
            ADD CONSTRAINT "fk_groups_owner_user_id" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }
}
