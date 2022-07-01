import { StarDto } from '@dtos/star.dto';
import { JwtGuard } from '@guard/jwt.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
  @Post(StarApiDefinition.toggleStar.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async toggleStar(@Request() req, @Body() dto: StarDto) {
    return await this.starService.toggleStar(req.user, dto);
  }

  /**
   * 检测是否收藏
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(StarApiDefinition.isStared.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async checkStar(@Request() req, @Body() dto: StarDto) {
    return await this.starService.isStared(req.user, dto);
  }

  /**
   * 获取组织内加星的知识库
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(StarApiDefinition.getStarWikisInOrganization.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getStarWikisInOrganization(@Request() req, @Param('organizationId') organizationId) {
    return await this.starService.getStarWikisInOrganization(req.user, organizationId);
  }

  /**
   * 获取知识库内收藏的文档
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(StarApiDefinition.getStarDocumentsInWiki.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getStarDocumentsInWiki(@Request() req, @Query() dto: StarDto) {
    return await this.starService.getStarDocumentsInWiki(req.user, dto);
  }

  /**
   * 获取组织内加星的文档（平铺）
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(StarApiDefinition.getStarDocumentsInOrganization.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getStarDocumentsInOrganization(@Request() req, @Param('organizationId') organizationId) {
    return await this.starService.getStarDocumentsInOrganization(req.user, organizationId);
  }
}
