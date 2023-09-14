import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';

@Exclude()
export class CreatePosPaidPlanDto {
  @IsNotEmpty()
  @MaxLength(1000)
  @Expose()
  title: string;

  @IsNotEmpty()
  @MaxLength(1000)
  @Expose()
  description: string;

  @Expose()
  active?: boolean;

  @Expose()
  isMostPopular?: boolean;

  @IsNotEmpty()
  @Expose()
  price: number;

  @IsNotEmpty()
  @Expose()
  balanceCredits: number;
}
