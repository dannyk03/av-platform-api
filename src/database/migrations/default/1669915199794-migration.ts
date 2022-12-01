import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1669915199794 implements MigrationInterface {
  name = 'migration1669915199794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."user_profile_companies_job_type_enum" AS ENUM('OfficeFullTime', 'Hybrid', 'RemoteFullTime')
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_companies"
            ADD "job_type" "public"."user_profile_companies_job_type_enum"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profile_companies" DROP COLUMN "job_type"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_profile_companies_job_type_enum"
        `);
  }
}
