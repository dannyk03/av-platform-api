import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1667638719675 implements MigrationInterface {
  name = 'migration1667638719675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD COLUMN IF NOT EXISTS "headers" jsonb
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images" 
            ALTER COLUMN "public_id" TYPE varchar(200)
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ALTER COLUMN "secure_url" TYPE varchar(500)
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ALTER COLUMN "description" TYPE varchar(1000)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs"
            ALTER COLUMN "description" TYPE varchar(200)
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ALTER COLUMN "secure_url" TYPE varchar(200)
        `);
    await queryRunner.query(`
            ALTER TABLE "product_images"
            ALTER COLUMN "public_id" TYPE varchar(200)
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "headers"
        `);
  }
}
