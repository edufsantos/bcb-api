import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class DefaultQuery {
  @Expose()
  @Transform(({ value }) => Number(value || 0))
  skip: number;

  @Expose()
  @Transform(({ value }) => Math.min(Number(value || 30), 100))
  take: number;
}
