import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: '用户头像类型错误（正确类型为：String）' })
  @IsOptional()
  readonly avatar?: string;

  @IsString({ message: ' 用户邮箱类型错误（正确类型为：String）' })
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @MinLength(5, { message: '邮箱验证码至少5个字符' })
  @IsString({ message: '邮箱验证码错误（正确类型为：String）' })
  @IsOptional({ message: '邮箱验证码不能为空' })
  verifyCode?: string;
}
