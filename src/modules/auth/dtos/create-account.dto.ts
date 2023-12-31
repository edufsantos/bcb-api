import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { IsEqualTo } from 'src/shared/decorators/class-validator/IsEqualTo';

@Exclude()
export class CreateAccountDto {
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
}
