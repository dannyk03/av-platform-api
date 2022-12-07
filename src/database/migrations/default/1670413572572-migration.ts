import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1670413572572 implements MigrationInterface {
  name = 'migration1670413572572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "fk_group_invite_members_user_invite_creator_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "fk_group_invite_members_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP COLUMN "user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP COLUMN "user_invite_creator_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD "user_invity_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD "user_invitor_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD CONSTRAINT "fk_group_invite_members_user_invity_id" FOREIGN KEY ("user_invity_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD CONSTRAINT "fk_group_invite_members_user_invitor_id" FOREIGN KEY ("user_invitor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "fk_group_invite_members_user_invitor_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "fk_group_invite_members_user_invity_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP COLUMN "user_invitor_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP COLUMN "user_invity_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD "user_invite_creator_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD "user_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD CONSTRAINT "fk_group_invite_members_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD CONSTRAINT "fk_group_invite_members_user_invite_creator_id" FOREIGN KEY ("user_invite_creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }
}
