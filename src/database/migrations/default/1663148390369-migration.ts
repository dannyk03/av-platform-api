import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1663148390369 implements MigrationInterface {
  name = 'migration1663148390369';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings" DROP COLUMN "address_line1"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings"
            ADD "address_line1" character varying(100)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings" DROP COLUMN "address_line2"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings"
            ADD "address_line2" character varying(100)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings" DROP COLUMN "city"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings"
            ADD "city" character varying(50)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings" DROP COLUMN "state"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings"
            ADD "state" character varying(50)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings" DROP COLUMN "zip_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings"
            ADD "zip_code" character varying(30)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings" DROP COLUMN "zip_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings"
            ADD "zip_code" character varying(20)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings" DROP COLUMN "state"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings"
            ADD "state" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings" DROP COLUMN "city"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings"
            ADD "city" character varying(30)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings" DROP COLUMN "address_line2"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings"
            ADD "address_line2" character varying(60)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings" DROP COLUMN "address_line1"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profile_shippings"
            ADD "address_line1" character varying(60)
        `);
  }
}
