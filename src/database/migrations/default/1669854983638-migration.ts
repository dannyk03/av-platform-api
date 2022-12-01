import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1669854983638 implements MigrationInterface {
  name = 'migration1669854983638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "groups"
            ADD "invite_code" character varying(21) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "groups"
            ADD CONSTRAINT "uq_groups_invite_code" UNIQUE ("invite_code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_groups_invite_code" ON "groups" ("invite_code")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_groups_invite_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups" DROP CONSTRAINT "uq_groups_invite_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups" DROP COLUMN "invite_code"
        `);
  }
}
