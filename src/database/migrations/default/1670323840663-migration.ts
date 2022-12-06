import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1670323840663 implements MigrationInterface {
  name = 'migration1670323840663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TYPE "public"."group_invite_members_invite_status_enum"
            RENAME TO "group_invite_members_invite_status_enum_old"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."group_invite_members_invite_status_enum" AS ENUM('accept', 'reject', 'pending', 'cancel')
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ALTER COLUMN "invite_status" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ALTER COLUMN "invite_status" TYPE "public"."group_invite_members_invite_status_enum" USING "invite_status"::"text"::"public"."group_invite_members_invite_status_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ALTER COLUMN "invite_status"
            SET DEFAULT 'pending'
        `);
    await queryRunner.query(`
            DROP TYPE "public"."group_invite_members_invite_status_enum_old"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."group_invite_members_invite_status_enum_old" AS ENUM('accept', 'pending', 'reject')
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ALTER COLUMN "invite_status" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ALTER COLUMN "invite_status" TYPE "public"."group_invite_members_invite_status_enum_old" USING "invite_status"::"text"::"public"."group_invite_members_invite_status_enum_old"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ALTER COLUMN "invite_status"
            SET DEFAULT 'pending'
        `);
    await queryRunner.query(`
            DROP TYPE "public"."group_invite_members_invite_status_enum"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."group_invite_members_invite_status_enum_old"
            RENAME TO "group_invite_members_invite_status_enum"
        `);
  }
}
