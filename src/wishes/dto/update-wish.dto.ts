import {
  IsOptional,
  IsString,
  IsUrl,
  IsNumber,
  IsInt,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateWishDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Имя должно содержать минимум 1 символ' })
  @MaxLength(250, { message: 'Имя не может содержать больше 250 символов' })
  name?: string;

  @IsOptional()
  @IsUrl()
  link?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Min(0)
  @IsNumber()
  raised?: number;

  @IsOptional()
  @Min(0)
  @IsInt()
  copied?: number;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Имя должно содержать минимум 1 символ' })
  @MaxLength(1024, { message: 'Имя не может содержать больше 1024 символов' })
  description?: string;
}
