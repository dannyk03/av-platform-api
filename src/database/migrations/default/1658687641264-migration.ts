import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658687641264 implements MigrationInterface {
  name = 'migration1658687641264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user_profiles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "first_name" character varying(30),
                "last_name" character varying(30),
                "title" character varying(100),
                CONSTRAINT "pk_user_profiles_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "first_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "last_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "title"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "profile_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "uq_users_profile_id" UNIQUE ("profile_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_profile_id" FOREIGN KEY ("profile_id") REFERENCES "user_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_profile_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "uq_users_profile_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "profile_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "title" character varying(100)
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "last_name" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "first_name" character varying(30)
        `);
    await queryRunner.query(`
            DROP TABLE "user_profiles"
        `);
  }
}
