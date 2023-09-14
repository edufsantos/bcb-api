import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class MessageSerializer {
  constructor(partial: Partial<MessageSerializer>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: string;

  @Expose()
  text: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
