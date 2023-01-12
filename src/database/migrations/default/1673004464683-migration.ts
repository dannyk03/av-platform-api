import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1673004464683 implements MigrationInterface {
  name = 'migration1673004464683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "group_question_answers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "data" text NOT NULL,
                "group_question_id" uuid,
                CONSTRAINT "pk_group_question_answers_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "group_questions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "data" text NOT NULL,
                "group_id" uuid,
                "user_id" uuid,
                CONSTRAINT "pk_group_questions_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."gift_intent_additional_datas_occasion_enum"
            RENAME TO "gift_intent_additional_datas_occasion_enum_old"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."gift_intent_additional_datas_occasion_enum" AS ENUM(
                'ThankYou',
                'MakeASmile',
                'Birthday',
                'Wedding',
                'WorkAnniversary',
                'Housewarming',
                'Birth',
                'GetWell',
                'BabyShowers',
                'Engagement'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intent_additional_datas"
            ALTER COLUMN "occasion" TYPE "public"."gift_intent_additional_datas_occasion_enum" USING "occasion"::"text"::"public"."gift_intent_additional_datas_occasion_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."gift_intent_additional_datas_occasion_enum_old"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_question_answers"
            ADD CONSTRAINT "fk_group_question_answers_group_question_id" FOREIGN KEY ("group_question_id") REFERENCES "group_questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "group_questions"
            ADD CONSTRAINT "fk_group_questions_group_id" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "group_questions"
            ADD CONSTRAINT "fk_group_questions_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "group_questions" DROP CONSTRAINT "fk_group_questions_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_questions" DROP CONSTRAINT "fk_group_questions_group_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "group_question_answers" DROP CONSTRAINT "fk_group_question_answers_group_question_id"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."gift_intent_additional_datas_occasion_enum_old" AS ENUM(
                'BabyShowers',
                'Birth',
                'Birthday',
                'Engagement',
                'GetWell',
                'Housewarming',
                'MakeASmile',
                'ThankYou',
                'Wedding',
                'WeddingAnniversary',
                'WorkAnniversary'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_intent_additional_datas"
            ALTER COLUMN "occasion" TYPE "public"."gift_intent_additional_datas_occasion_enum_old" USING "occasion"::"text"::"public"."gift_intent_additional_datas_occasion_enum_old"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."gift_intent_additional_datas_occasion_enum"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."gift_intent_additional_datas_occasion_enum_old"
            RENAME TO "gift_intent_additional_datas_occasion_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "group_questions"
        `);
    await queryRunner.query(`
            DROP TABLE "group_question_answers"
        `);
  }
}
