import { RegisterUserDto, ResetPasswordDto } from '@dtos/create-user.dto';
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
  Query,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '@services/user.service';
import { UserApiDefinition } from '@think/domains';
import { Response as ExpressResponse } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取用户
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(UserApiDefinition.getAllUsers.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getUsers() {
    return this.userService.getUsers();
  }

  /**
   * 注册
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(UserApiDefinition.register.server)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: RegisterUserDto) {
    return await this.userService.createUser(user);
  }

  /**
   * 登录
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(UserApiDefinition.login.server)
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: LoginUserDto, @Res({ passthrough: true }) response: ExpressResponse) {
    const { user: data, token, domain, expiresIn } = await this.userService.login(user);
    response.cookie('token', token, {
      domain,
      expires: new Date(new Date().getTime() + expiresIn),
      httpOnly: true,
      sameSite: 'lax',
    });
    return { ...data, token };
  }

  /**
   * 重置密码
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(UserApiDefinition.resetPassword.server)
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() user: ResetPasswordDto) {
    return await this.userService.resetPassword(user);
  }

  /**
   * 登出
   */
  @Post(UserApiDefinition.logout.server)
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: ExpressResponse) {
    const { token, domain } = await this.userService.logout();
    response.cookie('token', token, {
      expires: new Date(),
      domain,
      httpOnly: true,
      sameSite: 'lax',
    });
    return;
  }

  /**
   * 更新
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(UserApiDefinition.update.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async updateUser(@Request() req, @Body() dto: UpdateUserDto) {
    return await this.userService.updateUser(req.user, dto);
  }

  /**
   * 获取系统配置
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(UserApiDefinition.getSystemConfig.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getSystemConfig(@Request() req) {
    return await this.userService.getSystemConfig(req.user);
  }

  /**
   * 发送测试邮件
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(UserApiDefinition.sendTestEmail.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async sendTestEmail(@Request() req) {
    return await this.userService.sendTestEmail(req.user);
  }

  /**
   * 更新系统配置
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(UserApiDefinition.updateSystemConfig.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async toggleLockSystem(@Request() req, @Body() systemConfig) {
    return await this.userService.updateSystemConfig(req.user, systemConfig);
  }

  /**
   * 锁定用户
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(UserApiDefinition.toggleLockUser.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async toggleLockUser(@Request() req, @Query('targetUserId') targetUserId) {
    return await this.userService.toggleLockUser(req.user, targetUserId);
  }
}
