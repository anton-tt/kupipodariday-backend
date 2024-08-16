import { Length, IsString, IsUrl, IsArray, IsNotEmpty } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  name: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsArray()
  itemsId: Array<number>;
}
