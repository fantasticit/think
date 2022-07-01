import { OperateUserAuthDto } from '@dtos/auth.dto';
import { CreateOrganizationDto } from '@dtos/organization.dto';
import { JwtGuard } from '@guard/jwt.guard';
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
import { OrganizationService } from '@services/organization.service';
import { IPagination, OrganizationApiDefinition } from '@think/domains';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  /**
   * 创建组织
   * @param req
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(OrganizationApiDefinition.createOrganization.server)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  async register(@Request() req, @Body() dto: CreateOrganizationDto) {
    return await this.organizationService.createOrganization(req.user, dto);
  }

  /**
   * 更新组织信息
   * @param req
   * @param id
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(OrganizationApiDefinition.updateOrganization.server)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  async updateOrganization(@Request() req, @Param('id') id, @Body() dto: CreateOrganizationDto) {
    return await this.organizationService.updateOrganization(req.user, id, dto);
  }

  /**
   * 获取用户个人组织
   * @param req
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(OrganizationApiDefinition.getPersonalOrganization.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getPersonalOrganization(@Request() req) {
    return await this.organizationService.getPersonalOrganization(req.user);
  }

  /**
   * 获取用户除个人组织外可访问的组织
   * @param user
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(OrganizationApiDefinition.getUserOrganizations.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getUserOrganizations(@Request() req) {
    return await this.organizationService.getUserOrganizations(req.user);
  }

  /**
   * 获取组织详情
   * @param req
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(OrganizationApiDefinition.getOrganizationDetail.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getOrganizationDetail(@Request() req, @Param('id') id) {
    return await this.organizationService.getOrganizationDetail(req.user, id);
  }

  /**
   * 删除组织
   * @param req
   * @param id
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(OrganizationApiDefinition.deleteOrganization.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async deleteWiki(@Request() req, @Param('id') id) {
    return await this.organizationService.deleteOrganization(req.user, id);
  }

  /**
   * 获取组织成员
   * @param req
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(OrganizationApiDefinition.getMembers.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getMembers(@Request() req, @Param('id') id, @Query() pagination: IPagination) {
    return await this.organizationService.getMembers(req.user, id, pagination);
  }

  /**
   * 添加组织成员
   * 只有管理员可操作
   * @param req
   * @param id
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(OrganizationApiDefinition.addMemberById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async addMember(@Request() req, @Param('id') id, @Body() dto: OperateUserAuthDto) {
    return await this.organizationService.addMember(req.user, id, dto);
  }

  /**
   * 更新组织成员（一般为角色操作）
   * 只有管理员可操作
   * @param req
   * @param id
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(OrganizationApiDefinition.updateMemberById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateMember(@Request() req, @Param('id') id, @Body() dto: OperateUserAuthDto) {
    return await this.organizationService.updateMember(req.user, id, dto);
  }

  /**
   * 删除组织成员
   * 只有管理员可操作
   * @param req
   * @param id
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(OrganizationApiDefinition.deleteMemberById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async deleteMember(@Request() req, @Param('id') id, @Body() dto: OperateUserAuthDto) {
    return await this.organizationService.deleteMember(req.user, id, dto);
  }
}
