import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1661068927441 implements MigrationInterface {
  name = 'migration1661068927441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_user_auth_configs_login_code"
        `);
    await queryRunner.query(`
            CREATE TABLE "social_connection_request_blocks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "blocking_user_id" uuid NOT NULL,
                "blocked_user_id" uuid NOT NULL,
                CONSTRAINT "uq_blocking_blocked_social_connection_request_block" UNIQUE ("blocking_user_id", "blocked_user_id"),
                CONSTRAINT "pk_social_connection_request_blocks_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."social_connection_requests_status_enum" AS ENUM('Pending', 'Approved', 'Rejected', 'Blocked')
        `);
    await queryRunner.query(`
            CREATE TABLE "social_connection_requests" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "temp_addressee_email" character varying(30),
                "status" "public"."social_connection_requests_status_enum" NOT NULL DEFAULT 'Pending',
                "addressed_user_id" uuid NOT NULL,
                "addressee_user_id" uuid,
                CONSTRAINT "uq_addressed_addressee_social_connection_request" UNIQUE (
                    "addressed_user_id",
                    "addressee_user_id",
                    "temp_addressee_email",
                    "status"
                ),
                CONSTRAINT "pk_social_connection_requests_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "social_connections" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "user1_id" uuid NOT NULL,
                "user2_id" uuid NOT NULL,
                CONSTRAINT "uq_connection_users_social_connection" UNIQUE ("user1_id", "user2_id"),
                CONSTRAINT "pk_social_connections_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP CONSTRAINT "uq_user_auth_configs_login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP COLUMN "login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP COLUMN "login_code_expired_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_request_blocks"
            ADD CONSTRAINT "fk_social_connection_request_blocks_blocking_user_id" FOREIGN KEY ("blocking_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_request_blocks"
            ADD CONSTRAINT "fk_social_connection_request_blocks_blocked_user_id" FOREIGN KEY ("blocked_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests"
            ADD CONSTRAINT "fk_social_connection_requests_addressed_user_id" FOREIGN KEY ("addressed_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests"
            ADD CONSTRAINT "fk_social_connection_requests_addressee_user_id" FOREIGN KEY ("addressee_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connections"
            ADD CONSTRAINT "fk_social_connections_user1_id" FOREIGN KEY ("user1_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connections"
            ADD CONSTRAINT "fk_social_connections_user2_id" FOREIGN KEY ("user2_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "social_connections" DROP CONSTRAINT "fk_social_connections_user2_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connections" DROP CONSTRAINT "fk_social_connections_user1_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests" DROP CONSTRAINT "fk_social_connection_requests_addressee_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_requests" DROP CONSTRAINT "fk_social_connection_requests_addressed_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_request_blocks" DROP CONSTRAINT "fk_social_connection_request_blocks_blocked_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "social_connection_request_blocks" DROP CONSTRAINT "fk_social_connection_request_blocks_blocking_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD "login_code_expired_at" TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD "login_code" character varying(21)
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs"
            ADD CONSTRAINT "uq_user_auth_configs_login_code" UNIQUE ("login_code")
        `);
    await queryRunner.query(`
            DROP TABLE "social_connections"
        `);
    await queryRunner.query(`
            DROP TABLE "social_connection_requests"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."social_connection_requests_status_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "social_connection_request_blocks"
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_user_auth_configs_login_code" ON "user_auth_configs" ("login_code")
        `);
  }
}
