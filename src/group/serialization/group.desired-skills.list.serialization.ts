import { IGroupDesiredSkillsGetSerialization } from '@avo/type';

import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class GroupDesiredSkillsListSerialization
  implements IGroupDesiredSkillsGetSerialization
{
  @Expose()
  email: string;

  @Expose()
  @Transform(({ obj }) => obj.first_name)
  firstName?: string;

  @Expose()
  @Transform(({ obj }) => obj.last_name)
  lastName?: string;

  @Expose()
  @Transform(({ obj }) => obj.desired_skills)
  desiredSkills: string[];
}
