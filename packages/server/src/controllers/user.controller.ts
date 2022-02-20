import {
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  Patch,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtGuard } from '@guard/jwt.guard';
import { UserService } from '@services/user.service';
import { CreateUserDto } from '@dtos/create-user.dto';
import { LoginUserDto } from '@dtos/login-user.dto';
import { UpdateUserDto } from '@dtos/update-user.dto';

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
  async login(@Body() user: LoginUserDto) {
    const res = await this.userService.login(user);
    return res;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateUser(@Request() req, @Body() dto: UpdateUserDto) {
    return await this.userService.updateUser(req.user, dto);
  }
}
