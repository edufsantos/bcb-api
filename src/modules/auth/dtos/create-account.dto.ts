import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsEqualTo } from '../../../shared/decorators/class-validator/IsEqualTo';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @IsNotEmpty()
  phoneNumber: string;

  cpf: string;

  cnpj: string;

  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEqualTo<CreateAccountDto>('password')
  password_confirmation: string;
}
