import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1669813724449 implements MigrationInterface {
  name = 'migration1669813724449';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."group_invite_members_role_enum" AS ENUM('owner', 'basic')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."group_invite_members_invite_status_enum" AS ENUM('pending', 'accept', 'reject')
        `);
    await queryRunner.query(`
            CREATE TABLE "group_invite_members" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "role" "public"."group_invite_members_role_enum" NOT NULL DEFAULT 'basic',
                "code" character varying(21) NOT NULL,
                "invite_status" "public"."group_invite_members_invite_status_enum" NOT NULL DEFAULT 'pending',
                "temp_email" character varying(50),
                "expires_at" TIMESTAMP,
                "user_id" uuid,
                "group_id" uuid,
                CONSTRAINT "uq_group_invite_members_code" UNIQUE ("code"),
                CONSTRAINT "uq_group_invite_members_temp_email" UNIQUE ("temp_email"),
                CONSTRAINT "uq_group_invite_members_code_user_id" UNIQUE ("user_id", "code"),
                CONSTRAINT "pk_group_invite_members_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_group_invite_members_code" ON "group_invite_members" ("code")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_group_invite_members_invite_status" ON "group_invite_members" ("invite_status")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_group_invite_members_temp_email" ON "group_invite_members" ("temp_email")
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD CONSTRAINT "fk_group_invite_members_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members"
            ADD CONSTRAINT "fk_group_invite_members_group_id" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "fk_group_invite_members_group_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_invite_members" DROP CONSTRAINT "fk_group_invite_members_user_id"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_group_invite_members_temp_email"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_group_invite_members_invite_status"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_group_invite_members_code"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."group_invite_members_role_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."group_invite_members_invite_status_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "group_invite_members"
        `);
  }
}
