import { MigrationInterface, QueryRunner } from 'typeorm';

export class function1669288582798 implements MigrationInterface {
  name = 'function1669288582798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION is_leap_year(year INT)
            RETURNS BOOLEAN AS $$
                    SELECT ($1 % 4 = 0) AND (($1 % 100 <> 0) or ($1 % 400 = 0))
            $$ LANGUAGE sql IMMUTABLE STRICT;
        `);
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION is_leap_year(date DATE)
            RETURNS BOOLEAN AS $$
                    SELECT DATE_PART('month', DATE_TRUNC('year', $1)+'1 months 28 days'::INTERVAL) = 2;
            $$ LANGUAGE sql IMMUTABLE STRICT;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP FUNCTION IF EXISTS is_leap_year(year INT);
            DROP FUNCTION IF EXISTS is_leap_year(date DATE);
        `);
  }
}
