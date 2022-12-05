import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1670236032525 implements MigrationInterface {
  name = 'migration1670236032525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "uq_group_invite_members_temp_email"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD CONSTRAINT "uq_group_id_temp_email" UNIQUE ("group_id", "temp_email")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "uq_group_id_temp_email"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD CONSTRAINT "uq_group_invite_members_temp_email" UNIQUE ("temp_email")
        `);
  }
}
