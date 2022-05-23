import { TemplateDto } from '@dtos/template.dto';
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
import { TemplateService } from '@services/template.service';
import { TemplateApiDefinition } from '@think/domains';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  /**
   * 获取公开模板
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(TemplateApiDefinition.public.server)
  @HttpCode(HttpStatus.OK)
  async getPublicTemplates(@Query() qurey) {
    return this.templateService.getPublicTemplates(qurey);
  }

  /**
   * 获取个人创建模板
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(TemplateApiDefinition.own.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getOwnTemplates(@Request() req, @Query() qurey) {
    return this.templateService.getOwnTemplates(req.user, qurey);
  }

  /**
   * 新建模板
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(TemplateApiDefinition.add.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async create(@Request() req, @Body() dto: TemplateDto) {
    return await this.templateService.create(req.user, dto);
  }

  /**
   * 更新模板
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(TemplateApiDefinition.updateById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateTemplat(@Request() req, @Body() dto: TemplateDto & { id: string }) {
    return await this.templateService.updateTemplate(req.user, dto.id, dto);
  }

  /**
   * 获取模板详情
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(TemplateApiDefinition.getDetailById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getTemplate(@Request() req, @Param('id') id) {
    return this.templateService.getTemplate(req.user, id);
  }

  /**
   * 删除模板
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(TemplateApiDefinition.deleteById.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async deleteTemplat(@Request() req, @Param('id') documentId) {
    return await this.templateService.deleteTemplate(req.user, documentId);
  }
}
