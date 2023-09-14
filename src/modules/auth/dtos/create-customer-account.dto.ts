import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsEqualTo } from 'src/shared/decorators/class-validator/IsEqualTo';
import { CreateAccountDto } from './create-account.dto';

@Exclude()
export class CreateCustomerAccountDto {
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @Expose()
  @IsNotEmpty()
  phoneNumber: string;

  @Expose()
  cpf: string;

  @Expose()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Expose()
  @IsNotEmpty()
  @IsEqualTo<CreateAccountDto>('password')
  password_confirmation: string;

  @Expose()
  @IsNotEmpty()
  cnpj: string;

  @Expose()
  @IsNotEmpty()
  companyName: string;

  @Expose()
  active?: boolean;

  @Expose()
  @IsOptional()
  planId?: string;
}
