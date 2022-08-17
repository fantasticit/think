import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * 用户注册
 */
export class RegisterUserDto {
  @MinLength(1, { message: '用户账号至少1个字符' })
  @IsString({ message: '用户名称类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '用户账号不能为空' })
  name: string;

  @MinLength(5, { message: '用户密码至少5个字符' })
  @IsString({ message: '用户密码类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '用户密码不能为空' })
  password: string;

  @IsEmail({ message: '请输入正确的邮箱地址' })
  @IsString({ message: '用户邮箱类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '用户邮箱不能为空' })
  email: string;

  @MinLength(5, { message: '邮箱验证码至少5个字符' })
  @IsString({ message: '邮箱验证码错误（正确类型为：String）' })
  @IsOptional({ message: '邮箱验证码不能为空' })
  verifyCode?: string;
}

/**
 * 重置密码
 */
export class ResetPasswordDto {
  @MinLength(5, { message: '用户密码至少5个字符' })
  @IsString({ message: '用户密码类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '用户密码不能为空' })
  password: string;

  @MinLength(5, { message: '用户二次确认密码至少5个字符' })
  @IsString({ message: '用户二次确认密码类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '用户二次确认密码不能为空' })
  confirmPassword: string;

  @IsEmail({ message: '请输入正确的邮箱地址' })
  @IsString({ message: '用户邮箱类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '用户邮箱不能为空' })
  email: string;

  @MinLength(5, { message: '邮箱验证码至少5个字符' })
  @IsString({ message: '邮箱验证码错误（正确类型为：String）' })
  @IsOptional({ message: '邮箱验证码不能为空' })
  verifyCode: string;
}
