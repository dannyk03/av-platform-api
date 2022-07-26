import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1658876293711 implements MigrationInterface {
  name = 'migration1658876293711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "params" json
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "bodies" jsonb
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "status_code" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "anonymous" boolean NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "role_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "description"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "description" character varying(200) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "correlation_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "correlation_id" character varying(25) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD CONSTRAINT "fk_logs_role_id" FOREIGN KEY ("role_id") REFERENCES "acl_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "logs" DROP CONSTRAINT "fk_logs_role_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "correlation_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "correlation_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "description"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs"
            ADD "description" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "role_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "anonymous"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "status_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "bodies"
        `);
    await queryRunner.query(`
            ALTER TABLE "logs" DROP COLUMN "params"
        `);
  }
}
