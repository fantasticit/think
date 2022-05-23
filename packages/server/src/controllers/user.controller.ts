import { CreateUserDto } from '@dtos/create-user.dto';
import { LoginUserDto } from '@dtos/login-user.dto';
import { UpdateUserDto } from '@dtos/update-user.dto';
import { JwtGuard } from '@guard/jwt.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '@services/user.service';
import { Response as ExpressResponse } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: CreateUserDto) {
    return await this.userService.createUser(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: LoginUserDto, @Res({ passthrough: true }) response: ExpressResponse) {
    const { user: data, token } = await this.userService.login(user);
    response.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'lax' });
    return { ...data, token };
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) response: ExpressResponse) {
    response.cookie('token', '', { expires: new Date() });
    return;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateUser(@Request() req, @Body() dto: UpdateUserDto) {
    return await this.userService.updateUser(req.user, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getUsers() {
    return this.userService.getUsers();
  }
}
