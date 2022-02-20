import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: '用户名称类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '用户账号不能为空' })
  @MinLength(5, { message: '用户账号至少5个字符' })
  @MaxLength(20, { message: '用户账号最多20个字符' })
  readonly name: string;

  @IsString({ message: '用户密码类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '用户密码不能为空' })
  @MinLength(5, { message: '用户密码至少5个字符' })
  password: string;

  @IsString({ message: ' 用户确认密码类型错误（正确类型为：String）' })
  @MinLength(5, { message: '用户密码至少5个字符' })
  readonly confirmPassword: string;

  @IsString({ message: '用户头像类型错误（正确类型为：String）' })
  @IsOptional()
  readonly avatar?: string;

  @IsString({ message: ' 用户邮箱类型错误（正确类型为：String）' })
  @IsEmail()
  @IsOptional()
  readonly email?: string;
}
