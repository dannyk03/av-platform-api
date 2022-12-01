import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1669891515074 implements MigrationInterface {
  name = 'migration1669891515074';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "uq_group_invite_members_code_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups"
            ALTER COLUMN "invite_code" DROP NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "groups"
            ALTER COLUMN "invite_code"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD CONSTRAINT "uq_group_invite_members_code_user_id" UNIQUE ("code", "user_id")
        `);
  }
}
