import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
export class LinkPosPaidPlanDto {
  @Expose()
  @IsNotEmpty()
  customers: {
    id: string;
  }[];

  @Expose()
  @IsNotEmpty()
  posPaidPlanId: string;
}
