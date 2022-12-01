import { IGroupFunFactsGetSerialization } from '@avo/type';

import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class GroupFunFactsListSerialization
  implements IGroupFunFactsGetSerialization
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
  @Transform(({ obj }) => obj.fun_facts)
  funFacts: string[];
}
