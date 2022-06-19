import { AcpSubjectAuthSerialization } from '@acp/subject';
import { AcpSubject } from '@acp/subject/entity/acp-subject.entity';
import { Exclude, plainToInstance, Transform } from 'class-transformer';

export class AcpPolicyAuthSerialization {
  @Transform(({ value: subjects }) =>
    subjects.map((subject: AcpSubject) =>
      plainToInstance(AcpSubjectAuthSerialization, subject),
    ),
  )
  readonly subjects: AcpSubject[];

  @Exclude()
  readonly id: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}
