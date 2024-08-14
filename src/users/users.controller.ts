import {
  Controller,
  UseGuards,
  Request,
  Param,
  Body,
  Post,
  Get,
  Patch,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/private-response-user.dto';
import { UserPublicProfileResponseDto } from './dto/public-response-user.dto';
import { FindIdUserDto } from './dto/find-id-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import {
  USERS_PATH,
  ME_PATH,
  USERNAME_PATH,
  USERNAME_PARAM,
  FIND_PATH,
} from '../utils/consts';

@Controller(USERS_PATH)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Patch(ME_PATH)
  async updateUser(
    @Request()
    req: Request & { user: FindIdUserDto },
    @Body() userData: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.update(req.user.id, userData);
  }

  @UseGuards(JwtGuard)
  @Get(`${USERNAME_PATH}`)
  async getUserByName(
    @Param(USERNAME_PARAM)
    username: string,
  ): Promise<UserPublicProfileResponseDto> {
    return this.usersService.getByUsername(username);
  }

  @UseGuards(JwtGuard)
  @Get(ME_PATH)
  async getUserById(
    @Request() req: Request & { user: FindIdUserDto },
  ): Promise<UserProfileResponseDto> {
    return this.usersService.getById(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(FIND_PATH)
  async findUsersByQuery(
    @Body() user: FindUserDto,
  ): Promise<Array<UserProfileResponseDto>> {
    return this.usersService.getByQuery(user.query);
  }
}
