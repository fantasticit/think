import { IsString } from 'class-validator';
import { WikiUserRole } from '@think/share';

export class WikiUserDto {
  @IsString()
  readonly userName: string;

  @IsString()
  readonly userRole: WikiUserRole;
}
