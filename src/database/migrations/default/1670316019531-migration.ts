import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1670316019531 implements MigrationInterface {
  name = 'migration1670316019531';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD "user_invite_creator_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD CONSTRAINT "fk_group_invite_members_user_invite_creator_id" FOREIGN KEY ("user_invite_creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "fk_group_invite_members_user_invite_creator_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP COLUMN "user_invite_creator_id"
        `);
  }
}
