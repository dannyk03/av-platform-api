import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658767542619 implements MigrationInterface {
  name = 'migration1658767542619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_additional_datas" DROP COLUMN "occasion"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."gift_additional_datas_occasion_enum" AS ENUM(
                'ThankYou',
                'MakeASmile',
                'Birthday',
                'Wedding',
                'WeddingAnniversary',
                'WorkAnniversary',
                'Housewarming',
                'Birth',
                'Graduation',
                'BabyShowers',
                'Engagement'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_additional_datas"
            ADD "occasion" "public"."gift_additional_datas_occasion_enum" NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "gift_additional_datas" DROP COLUMN "occasion"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."gift_additional_datas_occasion_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "gift_additional_datas"
            ADD "occasion" character varying(20) NOT NULL
        `);
  }
}
