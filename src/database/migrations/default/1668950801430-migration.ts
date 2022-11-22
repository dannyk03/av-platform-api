import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1668950801430 implements MigrationInterface {
  name = 'migration1668950801430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_groups_slug"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups" DROP CONSTRAINT "uq_groups_slug"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups" DROP COLUMN "slug"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "groups"
            ADD "slug" character varying(300) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "groups"
            ADD CONSTRAINT "uq_groups_slug" UNIQUE ("slug")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_groups_slug" ON "groups" ("slug")
        `);
  }
}
