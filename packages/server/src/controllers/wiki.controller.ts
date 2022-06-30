import { OperateUserAuthDto } from '@dtos/auth.dto';
import { CreateWikiDto } from '@dtos/create-wiki.dto';
import { ShareWikiDto } from '@dtos/share-wiki.dto';
import { UpdateWikiDto } from '@dtos/update-wiki.dto';
import { JwtGuard } from '@guard/jwt.guard';
import { CheckWikiStatus, WikiStatusGuard } from '@guard/wiki-status.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WikiService } from '@services/wiki.service';
import { IPagination, WikiApiDefinition, WikiStatus } from '@think/domains';

@Controller('wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  /**
   * 获取用户所有知识库（创建的、参与的）
   * @param req
   * @param pagination
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(WikiApiDefinition.getAllWikis.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getAllWikis(@Request() req, @Param('organizationId') organizationId, @Query() pagination: IPagination) {
    return await this.wikiService.getAllWikis(req.user, organizationId, pagination);
  }

  /**
   * 获取用户拥有的知识库（一般是创建的，尚未实现知识库转移）
   * @param req
   * @param pagination
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(WikiApiDefinition.getOwnWikis.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getOwnWikis(@Request() req, @Param('organizationId') organizationId, @Query() pagination: IPagination) {
    return await this.wikiService.getOwnWikis(req.user, organizationId, pagination);
  }

  /**
   * 获取用户参与的知识库
   * @param req
   * @param pagination
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(WikiApiDefinition.getJoinWikis.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getJoinWikis(@Request() req, @Param('organizationId') organizationId, @Query() pagination: IPagination) {
    return await this.wikiService.getJoinWikis(req.user, organizationId, pagination);
  }

  /**
   * 新建知识库
   * @param req
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(WikiApiDefinition.add.server)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  async register(@Request() req, @Body() dto: CreateWikiDto) {
    return await this.wikiService.createWiki(req.user, dto);
  }

  /**
   * 获取知识库首页文档（首页文档为自动创建）
   * @param req
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(WikiApiDefinition.getHomeDocumentById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWikiHomeDocument(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.getWikiHomeDocument(req.user, wikiId);
  }

  /**
   * 获取知识库目录
   * @param req
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(WikiApiDefinition.getTocsById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWikiTocs(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.getWikiTocs(req.user, wikiId);
  }

  /**
   * 更新知识库目录（排序、父子关系）
   * @param req
   * @param wikiId
   * @param relations
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(WikiApiDefinition.updateTocsById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async orderWikiTocs(@Body() relations) {
    return await this.wikiService.orderWikiTocs(relations);
  }

  /**
   * 获取知识库详情
   * @param req
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(WikiApiDefinition.getDetailById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWikiDetail(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.getWikiDetail(req.user, wikiId);
  }

  /**
   * 修改知识库
   * @param req
   * @param wikiId
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(WikiApiDefinition.updateById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateWiki(@Request() req, @Param('id') wikiId, @Body() dto: UpdateWikiDto) {
    return await this.wikiService.updateWiki(req.user, wikiId, dto);
  }

  /**
   * 删除知识库
   * @param req
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(WikiApiDefinition.deleteById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async deleteWiki(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.deleteWiki(req.user, wikiId);
  }

  /**
   * 查看知识库成员
   * @param req
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(WikiApiDefinition.getMemberById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWikiUsers(@Request() req, @Param('id') wikiId, @Query() pagination: IPagination) {
    return await this.wikiService.getWikiUsers(req.user, wikiId, pagination);
  }

  /**
   * 添加知识库成员
   * @param req
   * @param wikiId
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(WikiApiDefinition.addMemberById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async addWikiUser(@Request() req, @Param('id') wikiId, @Body() dto: OperateUserAuthDto) {
    return await this.wikiService.addWikiUser(req.user, wikiId, dto);
  }

  /**
   * 更新知识库成员（一般为角色操作）
   * @param req
   * @param wikiId
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(WikiApiDefinition.updateMemberById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateWikiUser(@Request() req, @Param('id') wikiId, @Body() dto: OperateUserAuthDto) {
    return await this.wikiService.updateWikiUser(req.user, wikiId, dto);
  }

  /**
   * 删除知识库成员
   * @param req
   * @param wikiId
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(WikiApiDefinition.deleteMemberById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async deleteWikiUser(@Request() req, @Param('id') wikiId, @Body() dto: OperateUserAuthDto) {
    return await this.wikiService.deleteWikiUser(req.user, wikiId, dto);
  }

  /**
   * 分享（或关闭分享）知识库
   * @param req
   * @param wikiId
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(WikiApiDefinition.shareById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async toggleWorkspaceStatus(@Request() req, @Param('id') wikiId, @Body() dto: ShareWikiDto) {
    return await this.wikiService.shareWiki(req.user, wikiId, dto);
  }

  /**
   * 获取公开知识库首页文档
   * @param req
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(WikiApiDefinition.getPublicHomeDocumentById.server)
  @CheckWikiStatus(WikiStatus.public)
  @UseGuards(WikiStatusGuard)
  @HttpCode(HttpStatus.OK)
  async getWikiPublicHomeDocument(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.getPublicWikiHomeDocument(wikiId);
  }

  /**
   * 获取公开知识库目录
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get(WikiApiDefinition.getPublicTocsById.server)
  @CheckWikiStatus(WikiStatus.public)
  @UseGuards(WikiStatusGuard)
  async getPublicWikiTocs(@Param('id') wikiId) {
    return await this.wikiService.getPublicWikiTocs(wikiId);
  }

  /**
   * 获取公开知识库详情
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(WikiApiDefinition.getPublicDetailById.server)
  @CheckWikiStatus(WikiStatus.public)
  @UseGuards(WikiStatusGuard)
  @HttpCode(HttpStatus.OK)
  async getPublicWorkspaceDetail(@Param('id') wikiId) {
    return await this.wikiService.getPublicWikiDetail(wikiId);
  }

  /**
   * 获取所有公开知识库
   * @param pagination
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get(WikiApiDefinition.getPublicWikis.server)
  async getAllPublicWikis(@Query() pagination: IPagination) {
    return await this.wikiService.getAllPublicWikis(pagination);
  }
}
