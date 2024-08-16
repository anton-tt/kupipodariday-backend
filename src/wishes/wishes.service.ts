import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { PartialWishDto } from '../wishes/dto/partial-wish.dto';
import { UsersService } from '../users/users.service';
import { WishResponseDto } from './dto/response-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private usersService: UsersService,
  ) {}

  async create(
    userId: number,
    wishData: CreateWishDto,
  ): Promise<PartialWishDto> {
    const wish: Wish = await this.wishesRepository.save({
      ...wishData,
      owner: { id: userId },
    });
    return this.getNewPartialWishDto(wish);
  }

  async update(
    id: number,
    wishData: UpdateWishDto,
    userId: number,
  ): Promise<PartialWishDto> {
    let oldWish: Wish = await this.getById(id);
    this._isOwner(oldWish.owner.id, userId);
    oldWish = this._updateOldWish(wishData, oldWish);
    const wish: Wish = await this.wishesRepository.save(oldWish);
    return this.getNewPartialWishDto(wish);
  }

  async getById(id: number): Promise<Wish> {
    const wish: Wish = await this.wishesRepository.findOne({
      where: { id: id },
      relations: { owner: true },
    });
    if (!wish) {
      throw new NotFoundException('Подарок с данным id не найден в БД.');
    }
    return wish;
  }

  async getWishResponseDtoById(id: number): Promise<WishResponseDto> {
    const wish: Wish = await this.getById(id);
    return this._getNewWishResponseDto(wish);
  }

  async getLastWishResponseDto(): Promise<Array<WishResponseDto>> {
    const wishes: Array<Wish> = await this.wishesRepository.find({
      relations: { owner: true },
      order: { createdAt: 'DESC' },
      skip: 0,
      take: 40,
    });
    if (wishes.length === 0) {
      throw new NotFoundException('Подарки по запросу не найдены в БД.');
    }
    return wishes.map((wish) => {
      return this._getNewWishResponseDto(wish);
    });
  }

  async getTopWishResponseDto(): Promise<Array<WishResponseDto>> {
    const wishes: Array<Wish> = await this.wishesRepository.find({
      relations: { owner: true },
      order: { copied: 'DESC' },
      skip: 0,
      take: 20,
    });
    if (wishes.length === 0) {
      throw new NotFoundException('Подарки по запросу не найдены в БД.');
    }
    return wishes.map((wish) => {
      return this._getNewWishResponseDto(wish);
    });
  }

  async getWishesResponseDtoById(
    wishesId: Array<number>,
  ): Promise<Array<WishResponseDto>> {
    const wishes: Array<Wish> = await this.getAllWishesByIds(wishesId);
    if (wishes.length === 0) {
      throw new NotFoundException('Подарки по запросу не найдены в БД.');
    }
    return wishes.map((wish) => {
      return this._getNewWishResponseDto(wish);
    });
  }

  async delete(id: number, userId: number): Promise<WishResponseDto> {
    const wish: Wish = await this.getById(id);
    this._isOwner(wish.owner.id, userId);
    this.wishesRepository.delete(id);
    return this._getNewWishResponseDto(wish);
  }

  async copy(id: number, userId: number): Promise<PartialWishDto> {
    const wish: Wish = await this.getById(id);
    if (wish.owner.id === userId) {
      throw new ForbiddenException(
        'Подарок создан тем же пользователем, который отправил запрос на его копирование.',
      );
    }
    let newWish = this.wishesRepository.create({
      ...wish,
      id: null,
      owner: { id: userId },
    });
    newWish = await this.wishesRepository.save(newWish);
    wish.copied += 1;
    await this.wishesRepository.save(wish);
    return this.getNewPartialWishDto(newWish);
  }

  _updateOldWish(wishData: UpdateWishDto, oldWish: Wish): Wish {
    const { name, link, image, price, raised, copied, description } = wishData;
    name && oldWish.name !== name && (oldWish.name = name);
    link && oldWish.link !== link && (oldWish.link = link);
    image && oldWish.image !== image && (oldWish.image = image);
    price && oldWish.price !== price && (oldWish.price = price);
    raised && oldWish.raised !== raised && (oldWish.raised = raised);
    copied && oldWish.copied !== copied && (oldWish.copied = copied);
    description &&
      oldWish.description !== description &&
      (oldWish.description = description);
    return oldWish;
  }

  async getAllWishesByIds(wishesId: Array<number>) {
    return await this.wishesRepository.find({
      where: { id: In(wishesId) },
      relations: { owner: true },
    });
  }

  getNewPartialWishDto(wish: Wish): PartialWishDto {
    return new PartialWishDto(
      wish.id,
      wish.name,
      wish.link,
      wish.image,
      wish.price,
      wish.raised,
      wish.copied,
      wish.description,
      wish.createdAt.toDateString(),
      wish.updatedAt.toDateString(),
    );
  }

  _getNewWishResponseDto(wish: Wish): WishResponseDto {
    return new WishResponseDto(
      wish.id,
      wish.createdAt.toDateString(),
      wish.updatedAt.toDateString(),
      wish.name,
      wish.link,
      wish.image,
      wish.price,
      wish.raised,
      wish.copied,
      wish.description,
      this.usersService.getNewUserPublicProfileResponseDto(wish.owner),
      wish.offers,
      wish.wishlists,
    );
  }

  _isOwner(ownerId: number, userId: number): void {
    if (ownerId !== userId) {
      throw new ForbiddenException(
        'Пользователь не является владельцем, операцию нельзя выполнить.',
      );
    }
  }
}
