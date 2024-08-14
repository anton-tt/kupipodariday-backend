import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsNumber,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty({ message: 'Поле Имя обязательно для заполнения' })
  @IsString()
  @MinLength(1, { message: 'Имя должно содержать минимум 1 символ' })
  @MaxLength(250, { message: 'Имя не может содержать больше 250 символов' })
  name: string;

  @IsNotEmpty({ message: 'Поле Магазин обязательно для заполнения' })
  @IsUrl()
  link: string;

  @IsNotEmpty({ message: 'Поле Картинка обязательно для заполнения' })
  @IsUrl()
  image: string;

  @IsNotEmpty({ message: 'Поле Цена обязательно для заполнения' })
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty({ message: 'Поле Описание обязательно для заполнения' })
  @IsString()
  @MinLength(1, { message: 'Имя должно содержать минимум 1 символ' })
  @MaxLength(1024, { message: 'Имя не может содержать больше 1024 символов' })
  description: string;
}
