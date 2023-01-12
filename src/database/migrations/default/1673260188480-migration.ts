import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1673260188480 implements MigrationInterface {
  name = 'migration1673260188480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_question_answers"
            ADD "created_by_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "group_question_answers"
            ADD CONSTRAINT "fk_group_question_answers_created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_question_answers" DROP CONSTRAINT "fk_group_question_answers_created_by_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_question_answers" DROP COLUMN "created_by_id"
        `);
  }
}
