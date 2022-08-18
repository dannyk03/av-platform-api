import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1660819296268 implements MigrationInterface {
  name = 'migration1660819296268';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."idx_user_auth_configs_login_code"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."friendship_requests_status_enum" AS ENUM('Pending', 'Approved', 'Rejected')
        `);
    await queryRunner.query(`
            CREATE TABLE "friendship_requests" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "temp_addressee_email" character varying(30),
                "status" "public"."friendship_requests_status_enum" NOT NULL DEFAULT 'Pending',
                "addressed_user_id" uuid NOT NULL,
                "addressee_user_id" uuid,
                CONSTRAINT "uq_addressed_addressee_connection_request" UNIQUE (
                    "addressed_user_id",
                    "addressee_user_id",
                    "temp_addressee_email",
                    "status"
                ),
                CONSTRAINT "pk_friendship_requests_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "friendship_request_blocks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "blocking_user_id" uuid NOT NULL,
                "blocked_user_id" uuid NOT NULL,
                CONSTRAINT "uq_blocking_blocked_connection_request" UNIQUE ("blocking_user_id", "blocked_user_id"),
                CONSTRAINT "pk_friendship_request_blocks_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "friendships" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "addressed_user_id" uuid NOT NULL,
                "addressee_user_id" uuid NOT NULL,
                CONSTRAINT "uq_addressed_addressee_friendship" UNIQUE ("addressed_user_id", "addressee_user_id"),
                CONSTRAINT "pk_friendships_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP COLUMN "login_code_expired_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP CONSTRAINT "uq_user_auth_configs_login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_auth_configs" DROP COLUMN "login_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "friendship_requests"
            ADD CONSTRAINT "fk_friendship_requests_addressed_user_id" FOREIGN KEY ("addressed_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "friendship_requests"
            ADD CONSTRAINT "fk_friendship_requests_addressee_user_id" FOREIGN KEY ("addressee_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "friendship_request_blocks"
            ADD CONSTRAINT "fk_friendship_request_blocks_blocking_user_id" FOREIGN KEY ("blocking_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "friendship_request_blocks"
            ADD CONSTRAINT "fk_friendship_request_blocks_blocked_user_id" FOREIGN KEY ("blocked_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "friendships"
            ADD CONSTRAINT "fk_friendships_addressed_user_id" FOREIGN KEY ("addressed_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "friendships"
            ADD CONSTRAINT "fk_friendships_addressee_user_id" FOREIGN KEY ("addressee_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "friendships" DROP CONSTRAINT "fk_friendships_addressee_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "friendships" DROP CONSTRAINT "fk_friendships_addressed_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "friendship_request_blocks" DROP CONSTRAINT "fk_friendship_request_blocks_blocked_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "friendship_request_blocks" DROP CONSTRAINT "fk_friendship_request_blocks_blocking_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "friendship_requests" DROP CONSTRAINT "fk_friendship_requests_addressee_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "friendship_requests" DROP CONSTRAINT "fk_friendship_requests_addressed_user_id"
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
            ALTER TABLE "user_auth_configs"
            ADD "login_code_expired_at" TIMESTAMP
        `);
    await queryRunner.query(`
            DROP TABLE "friendships"
        `);
    await queryRunner.query(`
            DROP TABLE "friendship_request_blocks"
        `);
    await queryRunner.query(`
            DROP TABLE "friendship_requests"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."friendship_requests_status_enum"
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_user_auth_configs_login_code" ON "user_auth_configs" ("login_code")
        `);
  }
}
