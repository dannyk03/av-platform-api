import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1663582322136 implements MigrationInterface {
  name = 'migration1663582322136';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profile_homes" DROP COLUMN "city"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_homes"
            ADD "city" character varying(70)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_homes" DROP COLUMN "state"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_homes"
            ADD "state" character varying(70)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_homes" DROP COLUMN "country"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_homes"
            ADD "country" character varying(70)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings" DROP COLUMN "country"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings"
            ADD "country" character varying(50)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "first_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "first_name" character varying(50)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "last_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "last_name" character varying(50)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "last_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "last_name" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "first_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "first_name" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings" DROP COLUMN "country"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings"
            ADD "country" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_homes" DROP COLUMN "country"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_homes"
            ADD "country" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_homes" DROP COLUMN "state"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_homes"
            ADD "state" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_homes" DROP COLUMN "city"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_homes"
            ADD "city" character varying(30)
        `);
  }
}
