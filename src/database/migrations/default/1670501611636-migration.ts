import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1670501611636 implements MigrationInterface {
  name = 'migration1670501611636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."group_invite_member_links_role_enum" AS ENUM('owner', 'basic')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."group_invite_member_links_status_enum" AS ENUM('accept', 'reject', 'pending', 'cancel')
        `);
    await queryRunner.query(`
            CREATE TABLE "group_invite_member_links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "role" "public"."group_invite_member_links_role_enum" NOT NULL DEFAULT 'basic',
                "code" character varying(21) NOT NULL,
                "status" "public"."group_invite_member_links_status_enum" NOT NULL DEFAULT 'pending',
                "temp_email" character varying(50),
                "expires_at" TIMESTAMP,
                "invitee_user_id" uuid,
                "inviter_user_id" uuid,
                "group_id" uuid,
                CONSTRAINT "uq_group_invite_member_links_code" UNIQUE ("code"),
                CONSTRAINT "uq_group_id_user_id_status" UNIQUE ("group_id", "invitee_user_id", "status"),
                CONSTRAINT "uq_group_id_temp_email" UNIQUE ("group_id", "temp_email"),
                CONSTRAINT "pk_group_invite_member_links_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_group_invite_member_links_code" ON "group_invite_member_links" ("code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_group_invite_member_links_status" ON "group_invite_member_links" ("status")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_group_invite_member_links_temp_email" ON "group_invite_member_links" ("temp_email")
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
            ALTER TABLE "group_invite_member_links"
            ADD CONSTRAINT "fk_group_invite_member_links_invitee_user_id" FOREIGN KEY ("invitee_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_member_links"
            ADD CONSTRAINT "fk_group_invite_member_links_inviter_user_id" FOREIGN KEY ("inviter_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_member_links"
            ADD CONSTRAINT "fk_group_invite_member_links_group_id" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
            ALTER TABLE "group_invite_member_links" DROP CONSTRAINT "fk_group_invite_member_links_group_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_member_links" DROP CONSTRAINT "fk_group_invite_member_links_inviter_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_member_links" DROP CONSTRAINT "fk_group_invite_member_links_invitee_user_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_group_invite_links_code"
        `);
    await queryRunner.query(`
            DROP TABLE "group_invite_links"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_group_invite_member_links_temp_email"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_group_invite_member_links_status"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_group_invite_member_links_code"
        `);
    await queryRunner.query(`
            DROP TABLE "group_invite_member_links"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."group_invite_member_links_status_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."group_invite_member_links_role_enum"
        `);
  }
}
