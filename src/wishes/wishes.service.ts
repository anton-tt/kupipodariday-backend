import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { PartialWishDto } from '../wishes/dto/partial-wish.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
/*import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/private-response-user.dto';
import { UserPublicProfileResponseDto } from './dto/public-response-user.dto';
import { SignupUserResponseDto } from './dto/signup-response-user.dto';*/

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
    const user: User = await this.usersService.getUserById(userId);
    const wish: Wish = await this.wishesRepository.save(wishData);
    return this._getNewPartialWishDto(wish);
  }

  async update(
    id: number,
    wishData: UpdateWishDto,
    userId: number,
  ): Promise<PartialWishDto> {
    const user: User = await this.usersService.getUserById(userId);
    let oldWish: Wish = await this.getWishById(id);
    oldWish = this._updateOldWish(wishData, oldWish);
    const wish: Wish = await this.wishesRepository.save(oldWish);
    return this._getNewPartialWishDto(wish);
  }

  async getWishById(id: number): Promise<Wish> {
    const wish: Wish = await this.wishesRepository.findOneById(id);
    if (!wish) {
      throw new NotFoundException('Подарок с данным id не найден в БД.');
    }
    return wish;
  }

  _updateOldWish(wishData: UpdateWishDto, oldWish: Wish): Wish {
    const { name, link, image, price, raised, copied, description } = wishData;
    name && wishData.name !== name && (wishData.name = name);
    link && wishData.link !== link && (wishData.link = link);
    image && wishData.image !== image && (wishData.image = image);
    price && wishData.price !== price && (wishData.price = price);
    raised && wishData.raised !== raised && (wishData.raised = raised);
    copied && wishData.copied !== copied && (wishData.copied = copied);
    description &&
      wishData.description !== description &&
      (wishData.description = description);
    return oldWish;
  }

  _getNewPartialWishDto(wish: Wish): PartialWishDto {
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
}
