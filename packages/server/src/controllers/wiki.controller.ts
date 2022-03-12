import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Post,
  Param,
  Query,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from '@guard/jwt.guard';
import { IPagination } from '@think/domains';
import { WikiService } from '@services/wiki.service';
import { WikiUserDto } from '@dtos/wiki-user.dto';
import { CreateWikiDto } from '@dtos/create-wiki.dto';
import { UpdateWikiDto } from '@dtos/update-wiki.dto';
import { ShareWikiDto } from '@dtos/share-wiki.dto';

@Controller('wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  async register(@Request() req, @Body() dto: CreateWikiDto) {
    return await this.wikiService.createWiki(req.user, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('list/all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getAllWikis(@Request() req, @Query() pagination: IPagination) {
    return await this.wikiService.getAllWikis(req.user, pagination);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('list/own')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getOwnWikis(@Request() req, @Query() pagination: IPagination) {
    return await this.wikiService.getOwnWikis(req.user, pagination);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('list/join')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getJoinWikis(@Request() req, @Query() pagination: IPagination) {
    return await this.wikiService.getJoinWikis(req.user, pagination);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('detail/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWikiDetail(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.getWikiDetail(req.user, wikiId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('homedoc/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWikiHomeDocument(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.getWikiHomeDocument(req.user, wikiId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateWiki(@Request() req, @Param('id') wikiId, @Body() dto: UpdateWikiDto) {
    return await this.wikiService.updateWiki(req.user, wikiId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async deleteWiki(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.deleteWiki(req.user, wikiId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWikiUsers(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.getWikiUsers({ userId: req.user.id, wikiId });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('user/:id/add')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async addWikiUser(@Request() req, @Param('id') wikiId, @Body() dto: WikiUserDto) {
    return await this.wikiService.addWikiUser(req.user, wikiId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('user/:id/update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateWikiUser(@Request() req, @Param('id') wikiId, @Body() dto: WikiUserDto) {
    return await this.wikiService.updateWikiUser(req.user, wikiId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('user/:id/delete')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async deleteWikiUser(@Request() req, @Param('id') wikiId, @Body() dto: WikiUserDto) {
    return await this.wikiService.deleteWikiUser(req.user, wikiId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('share/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async toggleWorkspaceStatus(@Request() req, @Param('id') wikiId, @Body() dto: ShareWikiDto) {
    return await this.wikiService.shareWiki(req.user, wikiId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('tocs/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWikiTocs(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.getWikiTocs(req.user, wikiId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('tocs/:id/update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async orderWikiTocs(@Request() req, @Param('id') wikiId, @Body() relations) {
    return await this.wikiService.orderWikiTocs(req.user, wikiId, relations);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('docs/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWikiDocs(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.getWikiDocs(req.user, wikiId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('public/homedoc/:id')
  @HttpCode(HttpStatus.OK)
  async getWikiPublicHomeDocument(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.getWikiPublicHomeDocument(wikiId, req.headers['user-agent']);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('public/tocs/:id')
  @HttpCode(HttpStatus.OK)
  async getPublicWikiTocs(@Param('id') wikiId) {
    return await this.wikiService.getPublicWikiTocs(wikiId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('public/detail/:id')
  @HttpCode(HttpStatus.OK)
  async getPublicWorkspaceDetail(@Param('id') wikiId) {
    return await this.wikiService.getPublicWikiDetail(wikiId);
  }
}
