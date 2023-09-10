import { IsNotEmpty, MinLength } from 'class-validator';
import { IsEqualTo } from '../../../shared/decorators/class-validator/IsEqualTo';

export class ResetPasswordDto {
  @IsNotEmpty()
  reset_password_token: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEqualTo<ResetPasswordDto>('password')
  password_confirmation: string;
}
