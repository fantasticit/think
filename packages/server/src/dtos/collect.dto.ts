import { IsNotEmpty, IsString } from 'class-validator';
import { CollectType } from '@think/share';

export class CollectDto {
  @IsString({ message: '收藏目标Id类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '收藏目标Id不能为空' })
  targetId: string;

  @IsString({ message: '收藏目标类型类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '用户密码不能为空' })
  type: CollectType;
}
