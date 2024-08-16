import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { ResponseWishlistDto } from './dto/response-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { UserPublicProfileResponseDto } from '../users/dto/public-response-user.dto';
import { UsersService } from '../users/users.service';
import { Wish } from './../wishes/entities/wish.entity';
import { WishResponseDto } from '../wishes/dto/response-wish.dto';
import { WishesService } from '../wishes/wishes.service';
import { PartialWishDto } from '../wishes/dto/partial-wish.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wisheslistsRepository: Repository<Wishlist>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async create(
    userId: number,
    listData: CreateWishlistDto,
  ): Promise<ResponseWishlistDto> {
    const userDto: UserPublicProfileResponseDto =
      await this.usersService.getById(userId);
    const itemsId: Array<number> = listData.itemsId;
    const items: Array<{ id: number }> = itemsId.map((itemId: number) => {
      return { id: itemId };
    });
    const wishlist: Wishlist = await this.wisheslistsRepository.save({
      ...listData,
      owner: { id: userId },
      items: items,
    });
    const wishesDto: Array<WishResponseDto> =
      await this.wishesService.getWishesResponseDtoById(itemsId);
    return this._getNewResponseWishlistDto(wishlist, userDto, wishesDto);
  }

  async getById(id: number): Promise<Wishlist> {
    const wishlist: Wishlist = await this.wisheslistsRepository.findOne({
      where: { id: id },
      relations: { owner: true, items: true },
    });
    if (!wishlist) {
      throw new NotFoundException('Коллекция с данным id не найдена в БД.');
    }
    return wishlist;
  }

  async update(
    id: number,
    wishlistData: UpdateWishlistDto,
    userId: number,
  ): Promise<ResponseWishlistDto> {
    let oldWishlist: Wishlist = await this.getById(id);
    this._isOwner(oldWishlist.owner.id, userId);
    oldWishlist = await this._updateOldWishlist(wishlistData, oldWishlist);
    const wishlist: Wishlist = await this.wisheslistsRepository.save(
      oldWishlist,
    );
    const userDto: UserPublicProfileResponseDto =
      await this.usersService.getById(userId);
    const wishesDto: Array<WishResponseDto> = this._getWishesDtoArray(
      wishlist.items,
    );
    return this._getNewResponseWishlistDto(wishlist, userDto, wishesDto);
  }

  async getWishlistResponseDtoById(id: number): Promise<ResponseWishlistDto> {
    const wishlist: Wishlist = await this.getById(id);
    return this._getNewResponseWishlistDto(
      wishlist,
      this.usersService.getNewUserPublicProfileResponseDto(wishlist.owner),
      this._getWishesDtoArray(wishlist.items),
    );
  }

  async getAll(): Promise<Array<ResponseWishlistDto>> {
    const wishlists: Array<Wishlist> = await this.wisheslistsRepository.find({
      relations: { owner: true, items: true },
    });
    if (wishlists.length === 0) {
      throw new NotFoundException('Коллекции не найдены в БД.');
    }
    const responseWishlistsDto: Array<ResponseWishlistDto> = wishlists.map(
      (wishlists: Wishlist) => {
        return this._getNewResponseWishlistDto(
          wishlists,
          this.usersService.getNewUserPublicProfileResponseDto(wishlists.owner),
          this._getWishesDtoArray(wishlists.items),
        );
      },
    );
    return responseWishlistsDto;
  }

  async delete(id: number, userId: number): Promise<ResponseWishlistDto> {
    const wishlist: Wishlist = await this.getById(id);
    this._isOwner(wishlist.owner.id, userId);
    this.wisheslistsRepository.delete(id);
    return this._getNewResponseWishlistDto(wishlist, null, null);
  }

  _getNewResponseWishlistDto(
    wishlist: Wishlist,
    owner: UserPublicProfileResponseDto,
    wishesDto: Array<WishResponseDto>,
  ): ResponseWishlistDto {
    return new ResponseWishlistDto(
      wishlist.id,
      wishlist.createdAt.toDateString(),
      wishlist.updatedAt.toDateString(),
      wishlist.name,
      wishlist.image,
      owner,
      wishesDto,
    );
  }

  _getWishesDtoArray(wishes: Array<Wish>): Array<PartialWishDto> {
    return wishes.map((wish: Wish) => {
      return this.wishesService.getNewPartialWishDto(wish);
    });
  }

  _isOwner(ownerId: number, userId: number): void {
    if (ownerId !== userId) {
      throw new ForbiddenException(
        'Пользователь не является владельцем, операцию нельзя выполнить.',
      );
    }
  }

  async _updateOldWishlist(
    listData: UpdateWishlistDto,
    oldList: Wishlist,
  ): Promise<Wishlist> {
    const { name, image, itemsId } = listData;
    name && oldList.name !== name && (oldList.name = name);
    image && oldList.image !== image && (oldList.image = image);
    if (itemsId?.length > 0) {
      const items: Array<Wish> = await this.wishesService.getAllWishesByIds(
        itemsId,
      );
      oldList.items = items;
    }
    return oldList;
  }
}
