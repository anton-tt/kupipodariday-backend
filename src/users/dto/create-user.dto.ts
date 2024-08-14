import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsEmail,
  MinLength,
  MaxLength,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Поле Имя обязательно для заполнения' })
  @IsString()
  @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
  @MaxLength(30, { message: 'Имя не может содержать больше 30 символов' })
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Описание должно содержать минимум 2 символа' })
  @MaxLength(200, { message: 'Описание может содержать максимум 200 символов' })
  about?: string = 'Пока ничего не рассказал о себе';

  @IsOptional()
  @IsUrl()
  avatar?: string = 'https://i.pravatar.cc/300';

  @IsNotEmpty({ message: 'Почта пользователя обязательна для заполнения' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Пароль пользователя обязателен для заполнения' })
  @IsString()
  @Length(5, 25)
  password: string;
}
