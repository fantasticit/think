import { AdType } from '@think/domains';

import { IsNotEmpty, IsString } from 'class-validator';

export class AdDto {
  @IsString({ message: '广告位类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '广告位不能为空' })
  type: AdType;

  @IsString({ message: '广告封面图类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '广告封面图不能为空' })
  cover: string;

  @IsString({ message: '广告跳转链接类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '广告跳转链接不能为空' })
  url: string;
}
