import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { CustomerIOService } from '@/messaging/customer-io/service';
import { UserService } from '@/user/service';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class ProactiveEmailService {
  private readonly isProduction: boolean =
    this.configService.get<boolean>('app.isProduction');

  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private readonly defaultDataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async getBirthdayInXDaysConnections(inDays: number) {
    return this.defaultDataSource.query(
      `
      SELECT user1_id, up1.id AS user1_profile_id, u1.email AS user1Email, up1.first_name AS user1_firs_name, up1.last_name AS user1_last_name, user2_id,
	      data.id AS user2_profile_id, data.email AS user2_email, data.first_name AS user2_first_name, data.last_name AS user2_last_name, e_date
      FROM public.social_connections AS conn
      INNER JOIN
        (
          SELECT *
	        FROM 
          (
		        SELECT u.id AS user_id ,email, u.created_at AS u_created_at, up.first_name, up.last_name, up.id,
			        make_date(upcoming_event_year(CAST(up.birth_day AS INT), CAST(up.birth_month AS INT)), CAST(up.birth_month AS INT), CAST(up.birth_day AS INT)) AS e_date,
			        (NOW() + (${inDays} || 'DAY')::INTERVAL) AS target_day
  	        FROM public.users AS u
  	        LEFT JOIN public.user_profiles AS up
  	          ON up.user_id = u.id
  	        WHERE up.birth_day IS NOT NULL AND up.birth_month IS NOT NULL		
		      ) AS data_temp
	        WHERE e_date = make_date(CAST(Extract(year from target_day) AS INT), CAST(Extract(month from target_day) AS INT), CAST(Extract(day from target_day) AS INT))
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
