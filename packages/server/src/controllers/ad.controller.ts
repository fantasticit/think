import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AdApiDefinition } from '@think/domains';

import { AdDto } from '@dtos/ad.dto';
import { JwtGuard } from '@guard/jwt.guard';
import { AdService } from '@services/ad.service';

@Controller('ad')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(AdApiDefinition.create.server)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  async addAd(@Request() req, @Body() data: AdDto) {
    return await this.adService.addAd(req.user, data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(AdApiDefinition.getAll.server)
  @HttpCode(HttpStatus.OK)
  async getAds() {
    return await this.adService.getAds();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(AdApiDefinition.deleteById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async deleteAd(@Request() req, @Param('id') id) {
    return await this.adService.deleteAd(req.user, id);
  }
}
