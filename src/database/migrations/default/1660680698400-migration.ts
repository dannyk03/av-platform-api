import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1660680698400 implements MigrationInterface {
  name = 'migration1660680698400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "connection_request_blocks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "blocking_user_id" uuid,
                "blocked_user_id" uuid,
                CONSTRAINT "uq_blocking_blocked_connection_request" UNIQUE ("blocking_user_id", "blocked_user_id"),
                CONSTRAINT "rel_connection_request_blocks_blocking_user_id" UNIQUE ("blocking_user_id"),
                CONSTRAINT "rel_connection_request_blocks_blocked_user_id" UNIQUE ("blocked_user_id"),
                CONSTRAINT "pk_connection_request_blocks_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."connection_requests_status_enum" AS ENUM('Pending', 'Approved', 'Rejected')
        `);
    await queryRunner.query(`
            CREATE TABLE "connection_requests" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "temp_addressee_email" character varying(30) NOT NULL,
                "status" "public"."connection_requests_status_enum" NOT NULL,
                "requested_user_id" uuid,
                "addressee_user_id" uuid,
                CONSTRAINT "uq_requested_addressee_connection_request" UNIQUE (
                    "requested_user_id",
                    "addressee_user_id",
                    "status"
                ),
                CONSTRAINT "rel_connection_requests_requested_user_id" UNIQUE ("requested_user_id"),
                CONSTRAINT "rel_connection_requests_addressee_user_id" UNIQUE ("addressee_user_id"),
                CONSTRAINT "pk_connection_requests_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "connections" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "requested_user_id" uuid,
                "addressee_user_id" uuid,
                CONSTRAINT "uq_requested_addressee_connection" UNIQUE ("requested_user_id", "addressee_user_id"),
                CONSTRAINT "rel_connections_requested_user_id" UNIQUE ("requested_user_id"),
                CONSTRAINT "rel_connections_addressee_user_id" UNIQUE ("addressee_user_id"),
                CONSTRAINT "pk_connections_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "connection_request_blocks"
            ADD CONSTRAINT "fk_connection_request_blocks_blocking_user_id" FOREIGN KEY ("blocking_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "connection_request_blocks"
            ADD CONSTRAINT "fk_connection_request_blocks_blocked_user_id" FOREIGN KEY ("blocked_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "connection_requests"
            ADD CONSTRAINT "fk_connection_requests_requested_user_id" FOREIGN KEY ("requested_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "connection_requests"
            ADD CONSTRAINT "fk_connection_requests_addressee_user_id" FOREIGN KEY ("addressee_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "connections"
            ADD CONSTRAINT "fk_connections_requested_user_id" FOREIGN KEY ("requested_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "connections"
            ADD CONSTRAINT "fk_connections_addressee_user_id" FOREIGN KEY ("addressee_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "connections" DROP CONSTRAINT "fk_connections_addressee_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "connections" DROP CONSTRAINT "fk_connections_requested_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "connection_requests" DROP CONSTRAINT "fk_connection_requests_addressee_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "connection_requests" DROP CONSTRAINT "fk_connection_requests_requested_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "connection_request_blocks" DROP CONSTRAINT "fk_connection_request_blocks_blocked_user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "connection_request_blocks" DROP CONSTRAINT "fk_connection_request_blocks_blocking_user_id"
        `);
    await queryRunner.query(`
            DROP TABLE "connections"
        `);
    await queryRunner.query(`
            DROP TABLE "connection_requests"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."connection_requests_status_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "connection_request_blocks"
        `);
  }
}
