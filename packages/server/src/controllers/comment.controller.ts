import { CommentDto, UpdateCommentDto } from '@dtos/comment.dto';
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
import { CommentService } from '@services/comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('add')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async create(@Request() req, @Body() dto: CommentDto) {
    const userAgent = req.headers['user-agent'];
    return await this.commentService.create(req.user, userAgent, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateComment(@Request() req, @Body() dto: UpdateCommentDto) {
    return await this.commentService.updateComment(req.user, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async deleteComment(@Request() req, @Param('id') documentId) {
    return await this.commentService.deleteComment(req.user, documentId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('document/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getArticleComments(@Param('id') documentId, @Query() qurey) {
    return this.commentService.getDocumentComments(documentId, qurey);
  }
}
