import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1666095555388 implements MigrationInterface {
  name = 'migration1666095555388';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "invitation_links" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "user_id" uuid,
                CONSTRAINT "rel_invitation_links_user_id" UNIQUE ("user_id"),
                CONSTRAINT "pk_invitation_links_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "invitation_links"
            ADD CONSTRAINT "fk_invitation_links_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "invitation_links" DROP CONSTRAINT "fk_invitation_links_user_id"
        `);
    await queryRunner.query(`
            DROP TABLE "invitation_links"
        `);
  }
}
