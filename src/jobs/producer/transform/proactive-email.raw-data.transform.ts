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
    return obj.type;
  })
  type: EnumJobsCronName;
}

@Exclude()
export class UpcomingMileStoneNotificationDto {
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
