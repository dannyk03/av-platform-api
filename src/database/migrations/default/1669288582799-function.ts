import { MigrationInterface, QueryRunner } from 'typeorm';

export class function1669288582799 implements MigrationInterface {
  name = 'function1669288582799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION upcoming_event_year(day INT, month INT) RETURNS INT AS $$
            DECLARE
                now_day INT := EXTRACT(DAY FROM NOW());
                now_month INT := EXTRACT(MONTH FROM NOW());
                now_year INT := EXTRACT(YEAR FROM NOW());
                next_year INT := EXTRACT(YEAR FROM NOW() + INTERVAL '1 year');
            BEGIN
               RETURN CASE 
                        WHEN day = 29 AND month = 2 THEN CASE
                                                            WHEN is_leap_year(CAST(EXTRACT(YEAR FROM NOW()) AS INT)) AND make_date(now_year, month, day) >= NOW() THEN now_year
                                                            WHEN is_leap_year(CAST(EXTRACT(YEAR FROM NOW()) AS INT)) AND make_date(now_year, month, day) < NOW() THEN EXTRACT(YEAR FROM NOW() + INTERVAL '3 year')
                                                            WHEN NOT is_leap_year(CAST(EXTRACT(YEAR FROM NOW()) AS INT)) THEN CASE
                                                                                                                                    WHEN is_leap_year(CAST(EXTRACT(YEAR FROM NOW() + INTERVAL '1 year') AS INT)) THEN EXTRACT(YEAR FROM NOW() + INTERVAL '1 year')
                                                                                                                                    WHEN is_leap_year(CAST(EXTRACT(YEAR FROM NOW() + INTERVAL '2 year') AS INT)) THEN EXTRACT(YEAR FROM NOW() + INTERVAL '2 year')
                                                                                                                                    WHEN is_leap_year(CAST(EXTRACT(YEAR FROM NOW() + INTERVAL '3 year') AS INT)) THEN EXTRACT(YEAR FROM NOW() + INTERVAL '3 year')
                                                                                                                                    ELSE NULL
                                                                                                                                END
                                                            ELSE NULL
                                                            END												
                        WHEN month > now_month THEN now_year
                        WHEN month < now_month THEN next_year
                        WHEN day >= now_day AND month >= now_month THEN now_year
                        WHEN day >= now_day AND month >= now_month THEN now_year
                        WHEN day < now_day AND month <= now_month THEN next_year 
                        ELSE NULL
                    END;													
            END;
            $$ LANGUAGE plpgsql;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP FUNCTION IF EXISTS upcoming_event_year(day INT, month INT);
        `);
  }
}
