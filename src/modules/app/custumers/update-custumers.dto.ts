import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose } from 'class-transformer';
import { CreateCustomerAccountDto } from 'src/modules/auth/dtos/create-customer-account.dto';

@Exclude()
export class UpdateCustomerDto extends PartialType(CreateCustomerAccountDto) {
  @Expose()
  balanceCredits: number;

  @Expose()
  consumptionPlan: number;

  @Expose()
  posPaidPlanId: string;
}
