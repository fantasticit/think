import { AuthEnum } from '@think/domains';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthDto {
  @IsString({ message: '权限类型类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '权限类型不能为空' })
  auth: AuthEnum;

  @IsString({ message: '组织 Id 类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '组织 Id 不能为空' })
  organizationId: string;

  @IsString({ message: '知识库 Id 类型错误（正确类型为：String）' })
  @IsOptional()
  wikiId: string;

  @IsString({ message: '文档 Id 类型错误（正确类型为：String）' })
  @IsOptional()
  documentId: string;
}

export class OperateUserAuthDto {
  @IsString()
  readonly userAuth: AuthEnum;

  @IsString()
  readonly userName: string;
}
