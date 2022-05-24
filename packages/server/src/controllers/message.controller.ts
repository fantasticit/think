import { JwtGuard } from '@guard/jwt.guard';
import {
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
import { MessageService } from '@services/message.service';
import { MessageApiDefinition } from '@think/domains';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  /**
   * 获取未读消息
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(MessageApiDefinition.getUnread.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getUnreadMessages(@Request() req, @Query() query) {
    return this.messageService.getMessages(req.user, false, query);
  }

  /**
   * 获取已读消息
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(MessageApiDefinition.getRead.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getReadMessages(@Request() req, @Query() query) {
    return this.messageService.getMessages(req.user, true, query);
  }

  /**
   * 获取所有消息
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(MessageApiDefinition.getAll.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getAllReadMessages(@Request() req, @Query() query) {
    return this.messageService.getAllMessages(req.user, query);
  }

  /**
   * 将消息标记为已读
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(MessageApiDefinition.readMessage.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateComment(@Request() req, @Param('id') messageId) {
    return await this.messageService.readMessage(req.user, messageId);
  }
}
