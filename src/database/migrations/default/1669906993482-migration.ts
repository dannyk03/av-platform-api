import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1669906993482 implements MigrationInterface {
  name = 'migration1669906993482';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_groups_invite_code"
        `);
    await queryRunner.query(`
            CREATE TABLE "group_invite_links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "code" character varying(21) NOT NULL,
                "group_id" uuid,
                CONSTRAINT "uq_group_invite_links_code" UNIQUE ("code"),
                CONSTRAINT "pk_group_invite_links_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_group_invite_links_code" ON "group_invite_links" ("code")
        `);
    await queryRunner.query(`
            ALTER TABLE "groups" DROP CONSTRAINT "uq_groups_invite_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups" DROP COLUMN "invite_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_links"
            ADD CONSTRAINT "fk_group_invite_links_group_id" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_invite_links" DROP CONSTRAINT "fk_group_invite_links_group_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "groups"
            ADD "invite_code" character varying(21)
        `);
    await queryRunner.query(`
            ALTER TABLE "groups"
            ADD CONSTRAINT "uq_groups_invite_code" UNIQUE ("invite_code")
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_group_invite_links_code"
        `);
    await queryRunner.query(`
            DROP TABLE "group_invite_links"
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_groups_invite_code" ON "groups" ("invite_code")
        `);
  }
}
