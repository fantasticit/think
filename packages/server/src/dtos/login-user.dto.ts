import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: '用户名称类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '用户账号不能为空' })
  @MinLength(5, { message: '用户账号至少5个字符' })
  @MaxLength(20, { message: '用户账号最多20个字符' })
  readonly name: string;

  @IsString({ message: '用户密码类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '用户密码不能为空' })
  @MinLength(5, { message: '用户密码至少5个字符' })
  password: string;
}
