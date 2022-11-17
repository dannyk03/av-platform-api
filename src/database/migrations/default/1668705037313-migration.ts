import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1668705037313 implements MigrationInterface {
  name = 'migration1668705037313';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user_profile_mailings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "address_line1" character varying(100),
                "address_line2" character varying(100),
                "city" character varying(50),
                "state" character varying(50),
                "zip_code" character varying(30),
                "country" character varying(50),
                "delivery_instructions" character varying(1000),
                "user_profile_id" uuid,
                CONSTRAINT "rel_user_profile_mailings_user_profile_id" UNIQUE ("user_profile_id"),
                CONSTRAINT "pk_user_profile_mailings_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_mailings"
            ADD CONSTRAINT "fk_user_profile_mailings_user_profile_id" FOREIGN KEY ("user_profile_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profile_mailings" DROP CONSTRAINT "fk_user_profile_mailings_user_profile_id"
        `);
    await queryRunner.query(`
            DROP TABLE "user_profile_mailings"
        `);
  }
}
