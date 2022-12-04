import {
  EnumGroupRole,
  EnumGroupUpcomingMilestoneType,
  IGroupUpcomingMilestonesGetSerialization,
} from '@avo/type';

import { Exclude, Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';
import lowerCase from 'lodash/lowerCase';
import upperFirst from 'lodash/upperFirst';

import { HelperDateService } from '@/utils/helper/service';

@Exclude()
export class GroupUpcomingMilestonesListSerialization
  implements IGroupUpcomingMilestonesGetSerialization
{
  constructor(private readonly helperDateService: HelperDateService) {}

  @Expose()
  role: EnumGroupRole;

  @Expose()
  email: string;

  @Expose()
  @Transform(({ obj }) => obj.first_name)
  firstName?: string;

  @Expose()
  lastName?: string;

  @Expose()
  day: number;

  @Expose()
  month: number;

  @Expose()
  year: number;

  @Expose()
  @Transform(({ obj }) =>
    dayjs(`${obj.year}-${obj.month}-${obj.day}`).format('MMM Do'),
  )
  dateFormat: string;

  @Expose()
  type: EnumGroupUpcomingMilestoneType;

  @Expose()
  @Transform(({ obj }) => upperFirst(lowerCase(obj.type)))
  typeDisplay: string;
}
