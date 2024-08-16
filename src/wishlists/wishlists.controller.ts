import {
  Controller,
  UseGuards,
  Request,
  Param,
  Body,
  Post,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { FindIdUserDto } from '../users/dto/find-id-user.dto';
import { ResponseWishlistDto } from './dto/response-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WISHLISTS_PATH, ID_PATH, ID_PARAM } from '../utils/consts';

@Controller(WISHLISTS_PATH)
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createList(
    @Request() req: Request & { user: FindIdUserDto },
    @Body() listData: CreateWishlistDto,
  ): Promise<ResponseWishlistDto> {
    return this.wishlistsService.create(req.user.id, listData);
  }

  @UseGuards(JwtGuard)
  @Get(ID_PATH)
  async getListById(
    @Param(ID_PARAM)
    id: number,
  ): Promise<ResponseWishlistDto> {
    return this.wishlistsService.getWishlistResponseDtoById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(ID_PATH)
  async updateList(
    @Param(ID_PARAM) id: number,
    @Request() req: Request & { user: FindIdUserDto },
    @Body() listData: UpdateWishlistDto,
  ): Promise<ResponseWishlistDto> {
    return this.wishlistsService.update(id, listData, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getAllWishlists(): Promise<Array<ResponseWishlistDto>> {
    return this.wishlistsService.getAll();
  }

  @UseGuards(JwtGuard)
  @Delete(ID_PATH)
  async deleteList(
    @Param(ID_PARAM) id: number,
    @Request() req: Request & { user: FindIdUserDto },
  ): Promise<ResponseWishlistDto> {
    return this.wishlistsService.delete(id, req.user.id);
  }
}
