import {
  EnumGroupRole,
  EnumGroupUpcomingMilestoneType,
  IGroupUpcomingMilestonesGetSerialization,
} from '@avo/type';

import { Exclude, Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';
import lowerCase from 'lodash/lowerCase';
import upperFirst from 'lodash/upperFirst';

@Exclude()
export class GroupUpcomingMilestonesListSerialization
  implements IGroupUpcomingMilestonesGetSerialization
{
  @Expose()
  role: EnumGroupRole;

  @Expose()
  email: string;

  @Expose()
  @Transform(({ obj }) => obj.first_name)
  firstName?: string;

  @Expose()
  @Transform(({ obj }) => obj.last_name)
  lastName?: string;

  @Expose()
  day: number;

  @Expose()
  month: number;

  @Expose()
  year: number;

  @Expose()
  @Transform(({ obj }) => dayjs(obj.date).format('MMM Do'))
  dateFormat: string;

  @Expose()
  type: EnumGroupUpcomingMilestoneType;

  @Expose()
  @Transform(({ obj }) => upperFirst(lowerCase(obj.type)))
  typeDisplay: string;
}
