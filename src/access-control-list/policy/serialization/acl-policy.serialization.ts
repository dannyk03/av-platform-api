import { AclSubjectSerialization } from '@acl/subject';
import { Exclude, Transform, plainToInstance } from 'class-transformer';

import { AclSubject } from '@acl/subject/entity';

export class AclPolicySerialization {
  @Transform(({ value: subjects }) =>
    subjects.map((subject: AclSubject) =>
      plainToInstance(AclSubjectSerialization, subject),
    ),
  )
  readonly subjects: AclSubject[];

  @Exclude()
  readonly id: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}
