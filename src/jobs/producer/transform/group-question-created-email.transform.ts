import {
  Exclude,
  Expose,
  Transform,
  Type,
  plainToInstance,
} from 'class-transformer';

import { NormalizeEmail } from '@/utils/request/transform';

@Exclude()
export class Question {
  @Expose()
  id: string;
}

@Exclude()
export class Group {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

@Exclude()
export class User {
  @Expose()
  id: string;

  @Expose()
  @NormalizeEmail()
  email: string;

  @Expose()
  @Transform(({ obj }) => {
    return obj.profile.firstName;
  })
  firstName: string;

  @Expose()
  @Transform(({ obj }) => {
    return obj.profile.lastName;
  })
  lastName: string;
}

@Exclude()
export class GroupQuestionCreatedEmailTransform {
  @Expose()
  @Type(() => User)
  @Transform(({ obj }) => {
    return plainToInstance(User, obj.member.user);
  })
  recipient: User;

  @Expose()
  @Type(() => User)
  @Transform(({ obj }) => {
    return plainToInstance(User, obj.groupQuestion.createdBy);
  })
  questionOwner: User;

  @Expose()
  @Type(() => Group)
  @Transform(({ obj }) => {
    return plainToInstance(Group, obj.groupQuestion.group);
  })
  group: Group;

  @Expose()
  @Type(() => Question)
  @Transform(({ obj }) => {
    return plainToInstance(Question, obj.groupQuestion);
  })
  question: Question;
}
