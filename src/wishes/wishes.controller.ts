import {
  Controller,
  Headers,
  Request,
  Param,
  Body,
  Post,
  Get,
  Patch,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { PartialWishDto } from '../wishes/dto/partial-wish.dto';
import { WISHES_ROUT } from '../utils/consts';
import { User } from '../users/entities/user.entity';
/*import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/private-response-user.dto';
import { UserPublicProfileResponseDto } from './dto/public-response-user.dto';
import { FindIdUserDto } from './dto/find-id-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { SignupUserResponseDto } from './dto/signup-response-user.dto';*/

@Controller(WISHES_ROUT)
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Post()
  async createWish(
    /*@Request()
    req: Request & { userId: number },*/
    @Headers() id: number,
    @Body() wishData: CreateWishDto,
  ): Promise<PartialWishDto> {
    return this.wishesService.create(id, wishData);
  }

  @Patch(':id')
  async updateWish(
    @Param('id') id: string,
    /*@Request()
    req: Request,*/
    @Headers('user_id') userId: number,
    @Body() wishData: UpdateWishDto,
  ): Promise<PartialWishDto> {
    return this.wishesService.update(Number(id), wishData, userId);
  }
}
