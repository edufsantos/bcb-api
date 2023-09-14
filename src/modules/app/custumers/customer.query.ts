import { Prisma } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { DefaultQuery } from 'src/shared/default.query';

@Exclude()
class Search {
  @Expose()
  name?: Prisma.StringFilter | undefined;

  @Expose()
  active?: boolean;
}

@Exclude()
export class CustomerQuery extends DefaultQuery {
  @Expose()
  search?: Search;

  @Expose()
  orderBy?: {
    name: 'asc';
  };
}
