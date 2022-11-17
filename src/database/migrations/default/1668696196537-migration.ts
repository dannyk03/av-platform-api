import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1668696196537 implements MigrationInterface {
  name = 'migration1668696196537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "groups" DROP CONSTRAINT "fk_groups_owner_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups"
                RENAME COLUMN "owner_id" TO "owner_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups"
            ADD CONSTRAINT "fk_groups_owner_user_id" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "groups" DROP CONSTRAINT "fk_groups_owner_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups"
                RENAME COLUMN "owner_user_id" TO "owner_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups"
            ADD CONSTRAINT "fk_groups_owner_id" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }
}
