import { StarDto } from '@dtos/star.dto';
import { JwtGuard } from '@guard/jwt.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StarService } from '@services/star.service';
import { StarApiDefinition } from '@think/domains';

@Controller('star')
export class StarController {
  constructor(private readonly starService: StarService) {}

  /**
   * 收藏（或取消收藏）
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(StarApiDefinition.toggle.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async toggleStar(@Request() req, @Body() dto: StarDto) {
    return await this.starService.toggleStar(req.user, dto);
  }

  /**
   * 检测是否收藏
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(StarApiDefinition.check.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async checkStar(@Request() req, @Body() dto: StarDto) {
    return await this.starService.isStared(req.user, dto);
  }

  /**
   * 获取收藏的知识库
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(StarApiDefinition.wikis.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWikis(@Request() req) {
    return await this.starService.getWikis(req.user);
  }

  /**
   * 获取知识库内收藏的文档
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(StarApiDefinition.wikiDocuments.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWikiDocuments(@Request() req, @Query() dto: StarDto) {
    return await this.starService.getWikiDocuments(req.user, dto);
  }

  /**
   * 获取收藏的文档
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(StarApiDefinition.documents.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getDocuments(@Request() req) {
    return await this.starService.getDocuments(req.user);
  }
}
