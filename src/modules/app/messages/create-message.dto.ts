import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class CreateMessageDto {
  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  isWhatsApp: boolean;

  @Expose()
  @IsNotEmpty()
  @IsString()
  text: string;

  @Expose()
  @IsNotEmpty()
  phoneNumbers: string[];
}
