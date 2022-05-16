import { CreateWikiDto } from '@dtos/create-wiki.dto';
import { ShareWikiDto } from '@dtos/share-wiki.dto';
import { UpdateWikiDto } from '@dtos/update-wiki.dto';
import { WikiUserDto } from '@dtos/wiki-user.dto';
import { JwtGuard } from '@guard/jwt.guard';
import { CheckWikiStatus, WikiStatusGuard } from '@guard/wiki-status.guard';
import { CheckWikiUserRole, WikiUserRoleGuard } from '@guard/wiki-user.guard';
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
import { IPagination, WikiStatus, WikiUserRole } from '@think/domains';

@Controller('wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  /**
   * 新建知识库
   * @param req
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  async register(@Request() req, @Body() dto: CreateWikiDto) {
    return await this.wikiService.createWiki(req.user, dto);
  }

  /**
   * 获取用户所有知识库（创建的、参与的）
   * @param req
   * @param pagination
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('list/all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getAllWikis(@Request() req, @Query() pagination: IPagination) {
    return await this.wikiService.getAllWikis(req.user, pagination);
  }

  /**
   * 获取用户拥有的知识库（一般是创建的，尚未实现知识库转移）
   * @param req
   * @param pagination
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('list/own')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getOwnWikis(@Request() req, @Query() pagination: IPagination) {
    return await this.wikiService.getOwnWikis(req.user, pagination);
  }

  /**
   * 获取用户参与的知识库
   * @param req
   * @param pagination
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('list/join')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getJoinWikis(@Request() req, @Query() pagination: IPagination) {
    return await this.wikiService.getJoinWikis(req.user, pagination);
  }

  /**
   * 获取知识库详情
   * @param req
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('detail/:id')
  @HttpCode(HttpStatus.OK)
  @CheckWikiUserRole()
  @UseGuards(WikiUserRoleGuard)
  @UseGuards(JwtGuard)
  async getWikiDetail(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.getWikiDetail(req.user, wikiId);
  }

  /**
   * 获取知识库首页文档（首页文档为自动创建）
   * @param req
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('homedoc/:id')
  @HttpCode(HttpStatus.OK)
  @CheckWikiUserRole()
  @UseGuards(WikiUserRoleGuard)
  @UseGuards(JwtGuard)
  async getWikiHomeDocument(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.getWikiHomeDocument(req.user, wikiId);
  }

  /**
   * 修改知识库
   * 只有管理员可操作
   * @param req
   * @param wikiId
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  @CheckWikiUserRole(WikiUserRole.admin)
  @UseGuards(WikiUserRoleGuard)
  @UseGuards(JwtGuard)
  async updateWiki(@Request() req, @Param('id') wikiId, @Body() dto: UpdateWikiDto) {
    return await this.wikiService.updateWiki(req.user, wikiId, dto);
  }

  /**
   * 删除知识库
   * 只有管理员可操作
   * @param req
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  @CheckWikiUserRole(WikiUserRole.admin)
  @UseGuards(WikiUserRoleGuard)
  @UseGuards(JwtGuard)
  async deleteWiki(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.deleteWiki(req.user, wikiId);
  }

  /**
   * 查看知识库成员
   * 只有管理员可操作
   * @param req
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  @CheckWikiUserRole(WikiUserRole.admin)
  @UseGuards(WikiUserRoleGuard)
  @UseGuards(JwtGuard)
  async getWikiUsers(@Param('id') wikiId) {
    return await this.wikiService.getWikiUsers(wikiId);
  }

  /**
   * 添加知识库成员
   * 只有管理员可操作
   * @param req
   * @param wikiId
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('user/:id/add')
  @HttpCode(HttpStatus.OK)
  @CheckWikiUserRole(WikiUserRole.admin)
  @UseGuards(WikiUserRoleGuard)
  @UseGuards(JwtGuard)
  async addWikiUser(@Request() req, @Param('id') wikiId, @Body() dto: WikiUserDto) {
    return await this.wikiService.addWikiUser(req.user, wikiId, dto);
  }

  /**
   * 更新知识库成员（一般为角色操作）
   * 只有管理员可操作
   * @param req
   * @param wikiId
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('user/:id/update')
  @HttpCode(HttpStatus.OK)
  @CheckWikiUserRole(WikiUserRole.admin)
  @UseGuards(WikiUserRoleGuard)
  @UseGuards(JwtGuard)
  async updateWikiUser(@Request() req, @Param('id') wikiId, @Body() dto: WikiUserDto) {
    return await this.wikiService.updateWikiUser(req.user, wikiId, dto);
  }

  /**
   * 删除知识库成员
   * 只有管理员可操作
   * @param req
   * @param wikiId
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('user/:id/delete')
  @HttpCode(HttpStatus.OK)
  @CheckWikiUserRole(WikiUserRole.admin)
  @UseGuards(WikiUserRoleGuard)
  @UseGuards(JwtGuard)
  async deleteWikiUser(@Request() req, @Param('id') wikiId, @Body() dto: WikiUserDto) {
    return await this.wikiService.deleteWikiUser(req.user, wikiId, dto);
  }

  /**
   * 分享（或关闭分享）知识库
   * 只有管理员可操作
   * @param req
   * @param wikiId
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('share/:id')
  @HttpCode(HttpStatus.OK)
  @CheckWikiUserRole(WikiUserRole.admin)
  @UseGuards(WikiUserRoleGuard)
  @UseGuards(JwtGuard)
  async toggleWorkspaceStatus(@Request() req, @Param('id') wikiId, @Body() dto: ShareWikiDto) {
    return await this.wikiService.shareWiki(req.user, wikiId, dto);
  }

  /**
   * 获取知识库目录
   * @param req
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('tocs/:id')
  @HttpCode(HttpStatus.OK)
  @CheckWikiUserRole()
  @UseGuards(WikiUserRoleGuard)
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
  @Post('tocs/:id/update')
  @HttpCode(HttpStatus.OK)
  @CheckWikiUserRole()
  @UseGuards(WikiUserRoleGuard)
  @UseGuards(JwtGuard)
  async orderWikiTocs(@Body() relations) {
    return await this.wikiService.orderWikiTocs(relations);
  }

  /**
   * 获取知识库所有文档
   * @param req
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('docs/:id')
  @HttpCode(HttpStatus.OK)
  @CheckWikiUserRole()
  @UseGuards(WikiUserRoleGuard)
  @UseGuards(JwtGuard)
  async getWikiDocs(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.getWikiDocs(req.user, wikiId);
  }

  /**
   * 获取公开知识库首页文档
   * @param req
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('public/homedoc/:id')
  @CheckWikiStatus(WikiStatus.public)
  @UseGuards(WikiStatusGuard)
  @HttpCode(HttpStatus.OK)
  async getWikiPublicHomeDocument(@Request() req, @Param('id') wikiId) {
    return await this.wikiService.getPublicWikiHomeDocument(wikiId, req.headers['user-agent']);
  }

  /**
   * 获取公开知识库详情
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('public/detail/:id')
  @CheckWikiStatus(WikiStatus.public)
  @UseGuards(WikiStatusGuard)
  @HttpCode(HttpStatus.OK)
  async getPublicWorkspaceDetail(@Param('id') wikiId) {
    return await this.wikiService.getPublicWikiDetail(wikiId);
  }

  /**
   * 获取公开知识库目录
   * @param wikiId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('public/tocs/:id')
  @CheckWikiStatus(WikiStatus.public)
  @UseGuards(WikiStatusGuard)
  async getPublicWikiTocs(@Param('id') wikiId) {
    return await this.wikiService.getPublicWikiTocs(wikiId);
  }

  /**
   * 获取所有公开知识库
   * @param pagination
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('public/wikis')
  async getAllPublicWikis(@Query() pagination: IPagination) {
    return await this.wikiService.getAllPublicWikis(pagination);
  }
}
