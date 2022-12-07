import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1670361235232 implements MigrationInterface {
  name = 'migration1670361235232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_intent_additional_datas"
            ADD "target_date" TIMESTAMP
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_intent_additional_datas" DROP COLUMN "target_date"
        `);
  }
}
