import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
class CustomerData {
  constructor(partial: Partial<CustomerData>) {
    Object.assign(this, partial);
  }
  @Expose()
  active: boolean;

  @Expose()
  balanceCredits: string;

  @Expose()
  cnpj: string;

  @Expose()
  companyName: string;

  @Expose()
  consumptionPlan: string;

  @Expose()
  planPayment: string;

  @Expose()
  posPaidPlanId: string;
}
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
  @Transform(({ obj }) => !!obj.planPayment)
  isCustomer: boolean;

  @Expose()
  @Transform(({ obj }) => new CustomerData(obj))
  customerData: CustomerData;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
