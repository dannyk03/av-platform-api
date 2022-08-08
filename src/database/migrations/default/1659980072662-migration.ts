import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1659980072662 implements MigrationInterface {
  name = 'migration1659980072662';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "vendors" DROP CONSTRAINT "fk_vendors_logo_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors" DROP CONSTRAINT "uq_vendors_logo_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors" DROP COLUMN "logo_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendor_logos"
            ADD "vendor_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "vendor_logos"
            ADD CONSTRAINT "uq_vendor_logos_vendor_id" UNIQUE ("vendor_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors"
            ALTER COLUMN "description" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "vendor_logos"
            ADD CONSTRAINT "fk_vendor_logos_vendor_id" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "vendor_logos" DROP CONSTRAINT "fk_vendor_logos_vendor_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors"
            ALTER COLUMN "description"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "vendor_logos" DROP CONSTRAINT "uq_vendor_logos_vendor_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendor_logos" DROP COLUMN "vendor_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors"
            ADD "logo_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors"
            ADD CONSTRAINT "uq_vendors_logo_id" UNIQUE ("logo_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "vendors"
            ADD CONSTRAINT "fk_vendors_logo_id" FOREIGN KEY ("logo_id") REFERENCES "vendor_logos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
