import { TemplateDto } from '@dtos/template.dto';
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
import { TemplateService } from '@services/template.service';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('add')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async create(@Request() req, @Body() dto: TemplateDto) {
    return await this.templateService.create(req.user, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateTemplat(@Request() req, @Body() dto: TemplateDto & { id: string }) {
    return await this.templateService.updateTemplate(req.user, dto.id, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async deleteTemplat(@Request() req, @Param('id') documentId) {
    return await this.templateService.deleteTemplate(req.user, documentId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('detail/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getTemplate(@Request() req, @Param('id') id) {
    return this.templateService.getTemplate(req.user, id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('public')
  @HttpCode(HttpStatus.OK)
  async getPublicTemplates(@Query() qurey) {
    return this.templateService.getPublicTemplates(qurey);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('own')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getOwnTemplates(@Request() req, @Query() qurey) {
    return this.templateService.getOwnTemplates(req.user, qurey);
  }
}
