import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1670462594235 implements MigrationInterface {
  name = 'migration1670462594235';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD CONSTRAINT "uq_group_id_user_id_status" UNIQUE ("group_id", "invitee_user_id", "invite_status")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "uq_group_id_user_id_status"
        `);
  }
}
