import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1665493242692 implements MigrationInterface {
  name = 'migration1665493242692';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "fun_facts" character varying(500) array NOT NULL DEFAULT '{}'
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles"
            ADD "desired_skills" character varying(100) array NOT NULL DEFAULT '{}'
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
                'WeddingAnniversary',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."gift_intent_additional_datas_occasion_enum_old" AS ENUM(
                'BabyShowers',
                'Birth',
                'Birthday',
                'Engagement',
                'Graduation',
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
            ALTER TABLE "user_profiles" DROP COLUMN "desired_skills"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_profiles" DROP COLUMN "fun_facts"
        `);
  }
}
