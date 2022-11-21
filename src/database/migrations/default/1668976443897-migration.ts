import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1668976443897 implements MigrationInterface {
  name = 'migration1668976443897';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."group_members_role_enum" AS ENUM('owner')
        `);
    await queryRunner.query(`
            CREATE TABLE "group_members" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "role" "public"."group_members_role_enum",
                "user_id" uuid,
                "group_id" uuid,
                CONSTRAINT "uq_group_members_group_id_user_id" UNIQUE ("user_id", "group_id"),
                CONSTRAINT "pk_group_members_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "group_members"
            ADD CONSTRAINT "fk_group_members_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "group_members"
            ADD CONSTRAINT "fk_group_members_group_id" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_members" DROP CONSTRAINT "fk_group_members_group_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_members" DROP CONSTRAINT "fk_group_members_user_id"
        `);
    await queryRunner.query(`
            DROP TABLE "group_members"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."group_members_role_enum"
        `);
  }
}
