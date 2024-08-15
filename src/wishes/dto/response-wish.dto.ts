import { UserPublicProfileResponseDto } from '../../users/dto/public-response-user.dto';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';

export class WishResponseDto {
  id: number;

  createdAt: string;

  updatedAt: string;

  name: string;

  link: string;

  image: string;

  price: number;

  raised: number;

  copied: number;

  description: string;

  owner?: UserPublicProfileResponseDto;

  offers?: Array<Offer>;

  wishlists?: Array<Wishlist>;

  constructor(
    id: number,
    createdAt: string,
    updatedAt: string,
    name: string,
    link: string,
    image: string,
    price: number,
    raised: number,
    copied: number,
    description: string,
    owner: UserPublicProfileResponseDto,
    offers: Array<Offer>,
    wishlists: Array<Wishlist>,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.name = name;
    this.link = link;
    this.image = image;
    this.price = price;
    this.raised = raised;
    this.copied = copied;
    this.description = description;
    this.owner = owner;

    this.offers = offers;
    this.wishlists = wishlists;
  }
}
