import { Prisma } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { DefaultQuery } from 'src/shared/default.query';

@Exclude()
class Search {
  @Expose()
  title?: Prisma.StringFilter | undefined;

  @Expose()
  active?: boolean;
}

type OrderByTypes = 'title' | 'created_at';

@Exclude()
export class PlanQuery extends DefaultQuery {
  @Expose()
  search?: Search;

  @Expose()
  orderBy?: {
    [key in OrderByTypes]?: 'asc';
  };
}
