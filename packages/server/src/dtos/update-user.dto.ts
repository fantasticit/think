import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: '用户头像类型错误（正确类型为：String）' })
  @IsOptional()
  readonly avatar?: string;

  @IsString({ message: ' 用户邮箱类型错误（正确类型为：String）' })
  @IsEmail()
  @IsOptional()
  readonly email?: string;
}
