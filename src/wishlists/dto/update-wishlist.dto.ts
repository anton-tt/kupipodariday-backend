import { Length, IsString, IsUrl, IsArray, IsNotEmpty } from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  @Length(1, 250)
  name?: string;

  @IsUrl()
  image?: string;

  @IsArray()
  itemsId?: Array<number>;
}
