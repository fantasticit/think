import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WikiService } from '@services/wiki.service';
import { WikiStatus } from '@think/domains';

const KEY = 'WikiStatus';
export const CheckWikiStatus = (status: WikiStatus) => SetMetadata(KEY, status);

@Injectable()
export class WikiStatusGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly wikiService: WikiService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targetStatus = this.reflector.get<WikiStatus>(KEY, context.getHandler());

    if (!targetStatus) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { params, query, body } = request;
    const wikiId = params?.id || params?.wikiId || query?.id || query?.wikiId || body?.wikiId;

    const wiki = await this.wikiService.findById(wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }
    if (wiki.status !== targetStatus) {
      throw new HttpException('私有知识库，无法查看内容', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
