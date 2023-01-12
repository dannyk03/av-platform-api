import {
  Exclude,
  Expose,
  Transform,
  Type,
  plainToInstance,
} from 'class-transformer';

import { EnumJobsCronName } from '@/jobs/constant';

import { NormalizeEmail } from '@/utils/request/transform';

@Exclude()
export class Recipient {
  @Expose()
  @Transform(({ obj }) => {
    return obj.user1_id;
  })
  id: string;

  @Expose()
  @NormalizeEmail()
  @Transform(({ obj }) => {
    return obj.user1_email;
  })
  email: string;

  @Expose()
  @Transform(({ obj }) => {
    return obj.user1_first_name;
  })
  firstName: string;

  @Expose()
  @Transform(({ obj }) => {
    return obj.user1_last_name;
  })
  lastName: string;
}

@Exclude()
export class TargetUser {
  @Expose()
  @Transform(({ obj }) => {
    return obj.user2_id;
  })
  id: string;

  @Expose()
  @NormalizeEmail()
  @Transform(({ obj }) => {
    return obj.user2_email;
  })
  email: string;

  @Expose()
  @Transform(({ obj }) => {
    return obj.user2_first_name;
  })
  firstName: string;

  @Expose()
  @Transform(({ obj }) => {
    return obj.user2_last_name;
  })
  lastName: string;
}

@Exclude()
export class Milestone {
  @Expose()
  @Transform(({ obj }) => {
    const dateObj = new Date(obj.target_date);
    const day = dateObj.getUTCDate().toString().padStart(2, '0');

    return day;
  })
  day: string;

  @Expose()
  @Transform(({ obj }) => {
    const dateObj = new Date(obj.target_date);
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');

    return month;
  })
  month: string;
}

@Exclude()
export class UpcomingMileStoneNotificationDto {
  @Expose()
  @Transform(({ obj }) => {
    return obj.notificationType;
  })
  notificationType: EnumJobsCronName;

  @Expose()
  @Type(() => Recipient)
  @Transform(({ obj }) => {
    return plainToInstance(Recipient, obj);
  })
  recipient: Recipient;

  @Expose()
  @Type(() => TargetUser)
  @Transform(({ obj }) => {
    return plainToInstance(TargetUser, obj);
  })
  targetUser: TargetUser;

  @Type(() => Milestone)
  @Transform(({ obj }) => plainToInstance(Milestone, obj))
  @Expose()
  milestone: Milestone;
}
