import { CollectDto } from '@dtos/collect.dto';
import { JwtGuard } from '@guard/jwt.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CollectorService } from '@services/collector.service';
import { CollectorApiDefinition } from '@think/domains';

@Controller('collector')
export class CollectorController {
  constructor(private readonly collectorService: CollectorService) {}

  /**
   * 收藏（或取消收藏）
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(CollectorApiDefinition.toggle.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async toggleStar(@Request() req, @Body() dto: CollectDto) {
    return await this.collectorService.toggleStar(req.user, dto);
  }

  /**
   * 检测是否收藏
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(CollectorApiDefinition.check.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async checkStar(@Request() req, @Body() dto: CollectDto) {
    return await this.collectorService.isStared(req.user, dto);
  }

  /**
   * 获取收藏的知识库
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(CollectorApiDefinition.wikis.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWikis(@Request() req) {
    return await this.collectorService.getWikis(req.user);
  }

  /**
   * 获取收藏的文档
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(CollectorApiDefinition.documents.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getDocuments(@Request() req) {
    return await this.collectorService.getDocuments(req.user);
  }
}
