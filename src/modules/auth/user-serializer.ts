import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserSerializer {
  constructor(partial: Partial<UserSerializer>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
