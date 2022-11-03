import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667466969865 implements MigrationInterface {
  name = 'migration1667466969865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ALTER COLUMN "malware_detection_status"
            SET DEFAULT 'skip'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ALTER COLUMN "malware_detection_status"
            SET DEFAULT 'pending'
        `);
  }
}
