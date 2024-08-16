import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { PartialOfferDto } from './dto/partial-offer.dto';
import { ResponseOfferDto } from './dto/response-offer.dto';
import { UsersService } from '../users/users.service';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private userService: UsersService,
    private wishesService: WishesService,
  ) {}

  async create(
    offerData: CreateOfferDto,
    userId: number,
  ): Promise<PartialOfferDto> {
    const wish: Wish = await this.wishesService.getById(offerData.itemId);
    if (userId === wish.owner.id) {
      throw new ForbiddenException('Свой подарок нельзя оплатить.');
    }
    if (wish.price === wish.raised) {
      throw new ForbiddenException('Нужная сумма уже собрана.');
    }
    const rest = wish.price - wish.raised;
    if (rest < offerData.amount) {
      throw new ForbiddenException('Сумма больше, чем требуется.');
    }

    const newRaised = Number(wish.raised) + Number(offerData.amount);
    wish.raised = newRaised;
    await this.wishesService.update(wish.id, wish, wish.owner.id);

    const offer: Offer = await this.offersRepository.save({
      ...offerData,
      user: { id: userId },
      item: { id: wish.id },
    });
    return this._getNewPartialOfferDto(offer);
  }

  async getById(id: number): Promise<ResponseOfferDto> {
    const offer: Offer = await this.offersRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
        item: true,
      },
    });
    if (!offer) {
      throw new NotFoundException('Оффер с данным id не найден в БД.');
    }
    return this._getNewResponseOfferDto(offer);
  }

  async getAll(): Promise<Array<ResponseOfferDto>> {
    const offer: Array<Offer> = await this.offersRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
    if (offer.length === 0) {
      throw new NotFoundException('Офферы не найдены в БД.');
    }
    return offer.map((offer) => {
      return this._getNewResponseOfferDto(offer);
    });
  }

  _getNewPartialOfferDto(offer: Offer): PartialOfferDto {
    return new PartialOfferDto(
      offer.id,
      offer.createdAt.toString(),
      offer.updatedAt.toString(),
      offer.amount,
      offer.hidden,
    );
  }

  _getNewResponseOfferDto(offer: Offer): ResponseOfferDto {
    return new ResponseOfferDto(
      offer.id,
      offer.createdAt.toString(),
      offer.updatedAt.toString(),
      offer.amount,
      offer.hidden,
      this.userService.getNewUserPublicProfileResponseDto(offer.user),
      this.wishesService.getNewPartialWishDto(offer.item),
    );
  }
}
