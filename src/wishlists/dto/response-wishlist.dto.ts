import { UserPublicProfileResponseDto } from '../../users/dto/public-response-user.dto';
import { WishResponseDto } from '../../wishes/dto/response-wish.dto';

export class ResponseWishlistDto {
  id: number;

  createdAt: string;

  updatedAt: string;

  name: string;

  image: string;

  owner?: UserPublicProfileResponseDto;

  items?: Array<WishResponseDto>;

  constructor(
    id: number,
    createdAt: string,
    updatedAt: string,
    name: string,
    image: string,
    owner: UserPublicProfileResponseDto | null,
    items: Array<WishResponseDto> | null,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.name = name;
    this.image = image;
    this.owner = owner;
    this.items = items;
  }
}
