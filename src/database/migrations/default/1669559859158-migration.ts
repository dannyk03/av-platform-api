import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1669559859158 implements MigrationInterface {
  name = 'migration1669559859158';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TYPE "public"."group_members_role_enum"
            RENAME TO "group_members_role_enum_old"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."group_members_role_enum" AS ENUM('owner', 'basic')
        `);
    await queryRunner.query(`
            ALTER TABLE "group_members"
            ALTER COLUMN "role" TYPE "public"."group_members_role_enum" USING "role"::"text"::"public"."group_members_role_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_members"
            ALTER COLUMN "role"
            SET DEFAULT 'basic'
        `);
    await queryRunner.query(`
            DROP TYPE "public"."group_members_role_enum_old"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_members"
            ALTER COLUMN "role"
            SET DEFAULT 'basic'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_members"
            ALTER COLUMN "role" DROP DEFAULT
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."group_members_role_enum_old" AS ENUM('owner')
        `);
    await queryRunner.query(`
            ALTER TABLE "group_members"
            ALTER COLUMN "role" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "group_members"
            ALTER COLUMN "role" TYPE "public"."group_members_role_enum_old" USING "role"::"text"::"public"."group_members_role_enum_old"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."group_members_role_enum"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."group_members_role_enum_old"
            RENAME TO "group_members_role_enum"
        `);
  }
}
