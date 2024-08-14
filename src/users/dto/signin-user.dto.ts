import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class SigninUserDto {
  @IsNotEmpty({ message: 'Почта пользователя обязательна для заполнения' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'Пароль пользователя обязателен для заполнения' })
  @IsString()
  password: string;

  @IsInt()
  id: number;
}
