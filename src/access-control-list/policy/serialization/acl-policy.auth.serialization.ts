import { AclSubjectAuthSerialization } from '@acl/subject';
import { AclSubject } from '@acl/subject/entity/acl-subject.entity';
import { Exclude, plainToInstance, Transform } from 'class-transformer';

export class AclPolicyAuthSerialization {
  @Transform(({ value: subjects }) =>
    subjects.map((subject: AclSubject) =>
      plainToInstance(AclSubjectAuthSerialization, subject),
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
