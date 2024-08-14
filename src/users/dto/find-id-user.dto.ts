import { IsNotEmpty, IsInt } from 'class-validator';

export class FindIdUserDto {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
