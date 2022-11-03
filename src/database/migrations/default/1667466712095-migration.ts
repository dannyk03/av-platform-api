import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667466712095 implements MigrationInterface {
  name = 'migration1667466712095';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TYPE "public"."product_images_malware_detection_status_enum"
            RENAME TO "product_images_malware_detection_status_enum_old"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."product_images_malware_detection_status_enum" AS ENUM('pending', 'approved', 'rejected', 'skip')
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ALTER COLUMN "malware_detection_status" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ALTER COLUMN "malware_detection_status" TYPE "public"."product_images_malware_detection_status_enum" USING "malware_detection_status"::"text"::"public"."product_images_malware_detection_status_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ALTER COLUMN "malware_detection_status"
            SET DEFAULT 'pending'
        `);
    await queryRunner.query(`
            DROP TYPE "public"."product_images_malware_detection_status_enum_old"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."product_images_malware_detection_status_enum_old" AS ENUM('approved', 'pending', 'rejected')
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ALTER COLUMN "malware_detection_status" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ALTER COLUMN "malware_detection_status" TYPE "public"."product_images_malware_detection_status_enum_old" USING "malware_detection_status"::"text"::"public"."product_images_malware_detection_status_enum_old"
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ALTER COLUMN "malware_detection_status"
            SET DEFAULT 'pending'
        `);
    await queryRunner.query(`
            DROP TYPE "public"."product_images_malware_detection_status_enum"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."product_images_malware_detection_status_enum_old"
            RENAME TO "product_images_malware_detection_status_enum"
        `);
  }
}
