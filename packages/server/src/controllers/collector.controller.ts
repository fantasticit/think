import {
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtGuard } from '@guard/jwt.guard';
import { CollectorService } from '@services/collector.service';
import { CollectDto } from '@dtos/collect.dto';

@Controller('collector')
export class CollectorController {
  constructor(private readonly collectorService: CollectorService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('toggle')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async toggleStar(@Request() req, @Body() dto: CollectDto) {
    return await this.collectorService.toggleStar(req.user, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('check')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async checkStar(@Request() req, @Body() dto: CollectDto) {
    return await this.collectorService.isStared(req.user, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('documents')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getDocuments(@Request() req) {
    return await this.collectorService.getDocuments(req.user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('wikis')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWikis(@Request() req) {
    return await this.collectorService.getWikis(req.user);
  }
}
