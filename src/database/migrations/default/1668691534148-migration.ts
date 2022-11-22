import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1668691534148 implements MigrationInterface {
  name = 'migration1668691534148';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "groups" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" character varying(300) NOT NULL,
                "slug" character varying(300) NOT NULL,
                "description" character varying(1000),
                "is_active" boolean NOT NULL DEFAULT true,
                "owner_id" uuid NOT NULL,
                CONSTRAINT "uq_groups_name" UNIQUE ("name"),
                CONSTRAINT "uq_groups_slug" UNIQUE ("slug"),
                CONSTRAINT "pk_groups_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_groups_name" ON "groups" ("name")
        `);
    await queryRunner.query(`
            CREATE INDEX "idx_groups_slug" ON "groups" ("slug")
        `);
    await queryRunner.query(`
            ALTER TABLE "groups"
            ADD CONSTRAINT "fk_groups_owner_id" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "groups" DROP CONSTRAINT "fk_groups_owner_id"
        `);

    await queryRunner.query(`
            DROP INDEX "public"."idx_groups_slug"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."idx_groups_name"
        `);
  }
}
