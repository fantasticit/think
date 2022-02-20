import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from '@guard/jwt.guard';
import { DocumentService } from '@services/document.service';
import { DocAuthDto } from '@dtos/doc-auth.dto';
import { CreateDocumentDto } from '@dtos/create-document.dto';
import { UpdateDocumentDto } from '@dtos/update-document.dto';
import { ShareDocumentDto } from '@dtos/share-document.dto';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  async createDocument(@Request() req, @Body() dto: CreateDocumentDto) {
    return await this.documentService.createDocument(req.user, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('detail/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getDocumentDetail(@Request() req, @Param('id') documentId) {
    return await this.documentService.getDocumentDetail(
      req.user,
      documentId,
      req.headers['user-agent'],
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('update/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateDocument(
    @Request() req,
    @Param('id') documentId,
    @Body() dto: UpdateDocumentDto,
  ) {
    return await this.documentService.updateDocument(req.user, documentId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('children')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getChildrenDocuments(@Request() req, @Body() data) {
    return await this.documentService.getChildrenDocuments(req.user, data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async deleteDocument(@Request() req, @Param('id') documentId) {
    return await this.documentService.deleteDocument(req.user, documentId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('share/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async shareDocument(
    @Request() req,
    @Param('id') documentId,
    @Body() dto: ShareDocumentDto,
  ) {
    return await this.documentService.shareDocument(req.user, documentId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getDocUsers(@Request() req, @Param('id') documentId) {
    return await this.documentService.getDocUsers(req.user, documentId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('user/:id/add')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async addDocUser(@Request() req, @Body() dto: DocAuthDto) {
    return await this.documentService.addDocUser(req.user, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('user/:id/update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateDocUser(@Request() req, @Body() dto: DocAuthDto) {
    return await this.documentService.updateDocUser(req.user, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('user/:id/delete')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async deleteDocUser(@Request() req, @Body() dto: DocAuthDto) {
    return await this.documentService.deleteDocUser(req.user, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('public/detail/:id')
  @HttpCode(HttpStatus.OK)
  async getShareDocumentDetail(
    @Request() req,
    @Param('id') documentId,
    @Body() dto: ShareDocumentDto,
  ) {
    return await this.documentService.getPublicDocumentDetail(
      documentId,
      dto,
      req.headers['user-agent'],
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('public/children')
  @HttpCode(HttpStatus.OK)
  async getShareChildrenDocuments(@Body() data) {
    return await this.documentService.getShareChildrenDocuments(data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('recent')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWorkspaceDocuments(@Request() req) {
    return await this.documentService.getRecentDocuments(req.user);
  }
}
