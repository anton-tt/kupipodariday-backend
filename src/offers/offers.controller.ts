import {
  Controller,
  UseGuards,
  Request,
  Param,
  Body,
  Post,
  Get,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { FindIdUserDto } from '../users/dto/find-id-user.dto';
import { PartialOfferDto } from './dto/partial-offer.dto';
import { ResponseOfferDto } from './dto/response-offer.dto';
import { OFFERS_PATH, ID_PATH, ID_PARAM } from '../utils/consts';

@Controller(OFFERS_PATH)
export class OffersController {
  constructor(private offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createOffer(
    @Request() req: Request & { user: FindIdUserDto },
    @Body() offer: CreateOfferDto,
  ): Promise<PartialOfferDto> {
    return this.offersService.create(offer, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get(ID_PATH)
  async getOfferById(
    @Param(ID_PARAM)
    id: number,
  ): Promise<ResponseOfferDto> {
    return this.offersService.getById(id);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getAllOffers(): Promise<Array<ResponseOfferDto>> {
    return this.offersService.getAll();
  }
}
