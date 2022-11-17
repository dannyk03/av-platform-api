import { IGroupGetSerialization } from '@avo/type';

import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GroupGetSerialization implements IGroupGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;
}
