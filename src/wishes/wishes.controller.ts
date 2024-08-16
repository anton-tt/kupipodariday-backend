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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { PartialWishDto } from '../wishes/dto/partial-wish.dto';
import { FindIdUserDto } from '../users/dto/find-id-user.dto';
import {
  WISHES_PATH,
  ID_PATH,
  ID_PARAM,
  LAST_PATCH,
  TOP_PATCH,
  COPY_PATH,
} from '../utils/consts';
import { WishResponseDto } from './dto/response-wish.dto';

@Controller(WISHES_PATH)
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createWish(
    @Request() req: Request & { user: FindIdUserDto },
    @Body() wishData: CreateWishDto,
  ): Promise<PartialWishDto> {
    return this.wishesService.create(req.user.id, wishData);
  }

  @UseGuards(JwtGuard)
  @Get(LAST_PATCH)
  async getLastWish(): Promise<Array<WishResponseDto>> {
    return this.wishesService.getLastWishResponseDto();
  }

  @UseGuards(JwtGuard)
  @Get(TOP_PATCH)
  async getTopWish(): Promise<Array<WishResponseDto>> {
    return this.wishesService.getTopWishResponseDto();
  }

  @UseGuards(JwtGuard)
  @Get(ID_PATH)
  async getWishById(
    @Param(ID_PARAM)
    id: number,
  ): Promise<WishResponseDto> {
    return this.wishesService.getWishResponseDtoById(id);
  }

  @Patch(ID_PATH)
  async updateWish(
    @Param(ID_PARAM) id: number,
    @Body() wishData: UpdateWishDto,
  ): Promise<PartialWishDto> {
    return this.wishesService.update(id, wishData);
  }

  @UseGuards(JwtGuard)
  @Delete(ID_PATH)
  async deleteWish(
    @Param(ID_PARAM) id: number,
    @Request() req: Request & { user: FindIdUserDto },
  ): Promise<PartialWishDto> {
    return this.wishesService.delete(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(`${ID_PATH}/${COPY_PATH}`)
  async copyWish(
    @Param(ID_PARAM) id: number,
    @Request() req: Request & { user: FindIdUserDto },
  ): Promise<PartialWishDto> {
    return this.wishesService.copy(id, req.user.id);
  }
}
