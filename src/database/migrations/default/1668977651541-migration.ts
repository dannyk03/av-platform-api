import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1668977651541 implements MigrationInterface {
  name = 'migration1668977651541';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_members" DROP CONSTRAINT "fk_group_members_group_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_members" DROP CONSTRAINT "fk_group_members_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_members"
            ADD CONSTRAINT "fk_group_members_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "group_members"
            ADD CONSTRAINT "fk_group_members_group_id" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_members" DROP CONSTRAINT "fk_group_members_group_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_members" DROP CONSTRAINT "fk_group_members_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_members"
            ADD CONSTRAINT "fk_group_members_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "group_members"
            ADD CONSTRAINT "fk_group_members_group_id" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
