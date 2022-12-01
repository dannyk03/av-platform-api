import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1669907741544 implements MigrationInterface {
  name = 'migration1669907741544';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user_profile_companies" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(100),
                "role" character varying(100),
                "department" character varying(100),
                "user_profile_id" uuid,
                CONSTRAINT "rel_user_profile_companies_user_profile_id" UNIQUE ("user_profile_id"),
                CONSTRAINT "pk_user_profile_companies_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_companies"
            ADD CONSTRAINT "fk_user_profile_companies_user_profile_id" FOREIGN KEY ("user_profile_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profile_companies" DROP CONSTRAINT "fk_user_profile_companies_user_profile_id"
        `);
    await queryRunner.query(`
            DROP TABLE "user_profile_companies"
        `);
  }
}
