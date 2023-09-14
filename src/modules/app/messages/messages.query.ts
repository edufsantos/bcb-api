import { Prisma } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { DefaultQuery } from 'src/shared/default.query';

@Exclude()
class Search {
  @Expose()
  phoneNumber?: Prisma.StringFilter | undefined;

  @Expose()
  text?: Prisma.StringFilter | undefined;

  @Expose()
  isWhatsApp?: boolean;
}

type OrderByTypes = 'title' | 'created_at';

@Exclude()
export class MessagesQuery extends DefaultQuery {
  @Expose()
  search?: Search;

  @Expose()
  orderBy?: {
    [key in OrderByTypes]?: 'asc';
  };
}
