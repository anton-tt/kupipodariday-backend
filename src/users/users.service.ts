import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/private-response-user.dto';
import { UserPublicProfileResponseDto } from './dto/public-response-user.dto';
import { SignupUserResponseDto } from './dto/signup-response-user.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { WishResponseDto } from '../wishes/dto/response-wish.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(newUser: CreateUserDto): Promise<SignupUserResponseDto> {
    await this._checkNameAndEmailUser(newUser);
    const user: User = await this.usersRepository.save(newUser);
    return this._getNewUserProfileResponseDto(user);
  }

  async update(
    id: number,
    userData: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const oldUser: User = await this.getUserById(id);
    await this._checkNameAndEmailUser(userData);
    this._updateOldUser(userData, oldUser);
    const user: User = await this.usersRepository.save(oldUser);
    return this._getNewUserProfileResponseDto(user);
  }

  async getByUsername(username: string): Promise<UserPublicProfileResponseDto> {
    const user: User = await this.usersRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException('Пользователь с этим именем не найден в БД.');
    }
    return this.getNewUserPublicProfileResponseDto(user);
  }

  async getById(id: number): Promise<UserProfileResponseDto> {
    const user: User = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Пользователь с данным id не найден в БД.');
    }
    return this._getNewUserProfileResponseDto(user);
  }

  async getByQuery(query: string): Promise<Array<UserProfileResponseDto>> {
    const users: Array<User> | Array<UserProfileResponseDto> =
      await this.usersRepository.find({
        where: [{ username: query }, { email: query }],
      });
    if (users.length === 0) {
      throw new NotFoundException('Пользователи по запросу не найдены в БД.');
    }
    return users.map((user) => {
      return this._getNewUserProfileResponseDto(user);
    });
  }

  async getUserById(id: number): Promise<User> {
    const user: User = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException('Пользователь с данным id не найден в БД.');
    }
    return user;
  }

  async getUserByName(username: string): Promise<User> {
    const user: User = await this.usersRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException(
        'Пользователь с данным именем не найден в БД.',
      );
    }
    return user;
  }

  async _checkNameAndEmailUser(newUser: CreateUserDto | UpdateUserDto) {
    const { username, email } = newUser;
    let userByName: User = null;
    let userByEmail: User = null;
    if (username) {
      userByName = await this.usersRepository.findOne({
        where: { username },
      });
    }
    if (username) {
      userByEmail = await this.usersRepository.findOne({
        where: { email },
      });
    }
    if (userByName && userByEmail) {
      throw new ConflictException(
        'Пользователь с такими именем и эл.почтой уже существует.',
      );
    } else if (userByName) {
      throw new ConflictException(
        'Пользователь с таким именем уже существует.',
      );
    } else if (userByEmail) {
      throw new ConflictException(
        'Пользователь с такой эл.почтой уже существует.',
      );
    }
  }

  async getWishesByUserId(id: number): Promise<Array<WishResponseDto>> {
    const user: User = await this.usersRepository.findOne({
      where: { id },
      relations: {
        wishes: { owner: true },
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь с данным id не найден в БД.');
    }
    const wishes: Array<Wish> = user.wishes;
    if (wishes.length === 0) {
      console.log('У пользователя нет ниодного запроса на подарок.');
    }
    return wishes.map((wish) => {
      return this._getNewWishResponseDto(wish);
    });
  }

  async getWishesByUsername(username: string): Promise<Array<WishResponseDto>> {
    const user: User = await this.usersRepository.findOne({
      where: { username },
      relations: {
        wishes: { owner: true },
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь с данным id не найден в БД.');
    }
    const wishes: Array<Wish> = user.wishes;
    if (wishes.length === 0) {
      throw new NotFoundException(
        'У пользователя нет ни одного запроса на подарок.',
      );
    }
    return wishes.map((wish) => {
      return this._getNewWishResponseDto(wish);
    });
  }

  _updateOldUser(userData: UpdateUserDto, oldUser: User): User {
    const { username, about, avatar, email, password } = userData;
    username && oldUser.username !== username && (oldUser.username = username);
    about && userData.about !== about && (userData.about = about);
    avatar && userData.avatar !== avatar && (userData.avatar = avatar);
    email && userData.email !== email && (userData.email = email);
    password &&
      userData.password !== password &&
      (userData.password = password);
    return oldUser;
  }

  _getNewUserProfileResponseDto(user: User): UserProfileResponseDto {
    return new UserProfileResponseDto(
      user.id,
      user.username,
      user.about,
      user.avatar,
      user.email,
      user.createdAt.toString(),
      user.updatedAt.toString(),
    );
  }

  getNewUserPublicProfileResponseDto(user: User): UserPublicProfileResponseDto {
    return new UserPublicProfileResponseDto(
      user.id,
      user.username,
      user.about,
      user.avatar,
      user.createdAt.toString(),
      user.updatedAt.toString(),
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
      this.getNewUserPublicProfileResponseDto(wish.owner),
      wish.offers,
      wish.wishlists,
    );
  }
}
