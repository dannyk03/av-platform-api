import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1670430975734 implements MigrationInterface {
  name = 'migration1670430975734';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "fk_group_invite_members_user_invite_creator_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "fk_group_invite_members_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP COLUMN "user_invite_creator_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP COLUMN "user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD "invitee_user_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD "inviter_user_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD CONSTRAINT "fk_group_invite_members_invitee_user_id" FOREIGN KEY ("invitee_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD CONSTRAINT "fk_group_invite_members_inviter_user_id" FOREIGN KEY ("inviter_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "fk_group_invite_members_inviter_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "fk_group_invite_members_invitee_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP COLUMN "inviter_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP COLUMN "invitee_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD "user_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD "user_invite_creator_id" uuid
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
