import { CommentDto, UpdateCommentDto } from '@dtos/comment.dto';
import { JwtGuard } from '@guard/jwt.guard';
import { UserGuard } from '@guard/user.guard';
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
import { CommentService } from '@services/comment.service';
import { CommentApiDefinition } from '@think/domains';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 新建评论
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(CommentApiDefinition.add.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async create(@Request() req, @Body() dto: CommentDto) {
    const userAgent = req.headers['user-agent'];
    return await this.commentService.create(req.user, userAgent, dto);
  }

  /**
   * 更新评论
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(CommentApiDefinition.update.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateComment(@Request() req, @Body() dto: UpdateCommentDto) {
    return await this.commentService.updateComment(req.user, dto);
  }

  /**
   * 删除评论
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(CommentApiDefinition.delete.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async deleteComment(@Request() req, @Param('id') documentId) {
    return await this.commentService.deleteComment(req.user, documentId);
  }

  /**
   * 获取指定文档评论
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(CommentApiDefinition.documents.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  async getArticleComments(@Request() req, @Param('documentId') documentId, @Query() qurey) {
    const user = req.user;
    return this.commentService.getDocumentComments(user, documentId, qurey);
  }
}
