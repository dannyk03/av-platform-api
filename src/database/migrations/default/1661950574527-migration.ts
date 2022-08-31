import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1661950574527 implements MigrationInterface {
  name = 'migration1661950574527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links"
            ADD "user_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links"
            ADD CONSTRAINT "fk_organization_invite_links_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links" DROP CONSTRAINT "fk_organization_invite_links_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "organization_invite_links" DROP COLUMN "user_id"
        `);
  }
}
