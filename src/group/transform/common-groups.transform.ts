import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CommonGroupsTransformRowQuery {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  @Transform(({ obj }) => obj.created_at)
  readonly createdAt: Date;

  @Expose()
  @Transform(({ obj }) => obj.is_active)
  readonly isActive: Date;
}
