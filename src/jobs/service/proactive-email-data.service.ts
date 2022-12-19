import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';

import { EnumGroupUpcomingMilestoneType } from '@avo/type';

import { DataSource } from 'typeorm';

import { ConnectionNames } from '@/database/constant';

const columnsMap = {
  [EnumGroupUpcomingMilestoneType.WorkAnniversary]: {
    day: 'work_anniversary_day',
    month: 'work_anniversary_month',
  },
  [EnumGroupUpcomingMilestoneType.Birthday]: {
    day: 'birth_day',
    month: 'birth_month',
  },
};

@Injectable()
export class ProactiveEmailDataService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private readonly defaultDataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async getMilestoneInXDaysData(
    inDays: number,
    type: EnumGroupUpcomingMilestoneType,
  ) {
    const dayColumn = columnsMap[type].day;
    const monthColumn = columnsMap[type].month;

    // TODO [A20-205] refactor query
    return this.defaultDataSource.query(
      `
      SELECT
        user1_id,
        up1.id AS user1_profile_id,
        u1.email AS user1_email,
        up1.first_name AS user1_first_name,
        up1.last_name AS user1_last_name,
        user2_id,
	      data.id AS user2_profile_id,
	      data.email AS user2_email,
	      data.first_name AS user2_first_name,
	      data.last_name AS user2_last_name,
	      e_date
      FROM public.social_connections AS conn
      INNER JOIN
        (
          SELECT *
	        FROM
          (
		        SELECT
		            u.id AS user_id,
		            email,
		            u.created_at AS u_created_at,
		            up.first_name,
		            up.last_name,
		            up.id,
			          make_date(upcoming_event_year(
			            CAST(up.${dayColumn} AS INT), CAST(up.${monthColumn} AS INT)), CAST(up.${monthColumn} AS INT), CAST(up.${dayColumn} AS INT)
			          ) AS e_date,
			          (NOW() + (${inDays} || 'DAY')::INTERVAL) AS target_day
  	        FROM public.users AS u
  	        LEFT JOIN public.user_profiles AS up
  	          ON up.user_id = u.id
  	        WHERE up.${dayColumn} IS NOT NULL AND up.${monthColumn} IS NOT NULL
		      ) AS data_temp
	        WHERE e_date = make_date(CAST(Extract(year from target_day) AS INT), CAST(Extract(month from target_day) AS INT), CAST(Extract(day from target_day) AS INT))
	        AND user_id IN (SELECT user2_id FROM public.social_connections AS conn)
        ) AS data
	      ON conn.user2_id = user_id
      LEFT JOIN public.users AS u1
	      ON user1_id = u1.id
      LEFT JOIN public.user_profiles AS up1
	      ON u1.id = up1.user_id
      `,
    );
  }
}
