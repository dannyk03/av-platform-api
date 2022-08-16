import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1660502394944 implements MigrationInterface {
  name = 'migration1660502394944';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_auth_config_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_auth_config_id" FOREIGN KEY ("auth_config_id") REFERENCES "user_auth_configs"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_users_auth_config_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_users_auth_config_id" FOREIGN KEY ("auth_config_id") REFERENCES "user_auth_configs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
