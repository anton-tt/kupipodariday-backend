import { UserPublicProfileResponseDto } from '../../users/dto/public-response-user.dto';
import { PartialWishDto } from '../../wishes/dto/partial-wish.dto';

export class ResponseOfferDto {
  id: number;

  createdAt: string;

  updatedAt: string;

  amount: number;

  hidden: boolean;

  user: UserPublicProfileResponseDto;

  item: PartialWishDto;

  constructor(
    id: number,
    createdAt: string,
    updatedAt: string,
    amount: number,
    hidden: boolean,
    user: UserPublicProfileResponseDto,
    item: PartialWishDto,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.amount = amount;
    this.hidden = hidden;
    this.user = user;
    this.item = item;
  }
}
