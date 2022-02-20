import {
  Controller,
  Get,
  Post,
  HttpStatus,
  HttpCode,
  Query,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtGuard } from '@guard/jwt.guard';
import { MessageService } from '@services/message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/unread')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getUnreadMessages(@Request() req, @Query() query) {
    return this.messageService.getMessages(req.user, false, query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/read')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getReadMessages(@Request() req, @Query() query) {
    return this.messageService.getMessages(req.user, true, query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getAllReadMessages(@Request() req, @Query() query) {
    return this.messageService.getAllMessages(req.user, query);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/read/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateComment(@Request() req, @Param('id') messageId) {
    return await this.messageService.readMessage(req.user, messageId);
  }
}
