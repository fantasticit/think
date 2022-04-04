import { CanActivate, ExecutionContext, Injectable, SetMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WikiStatus } from '@think/domains';
import { WikiService } from '@services/wiki.service';

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
    const wikiId = params.id || params.wikiId || query.id || query.wikiId || body.wikiId;

    const wiki = await this.wikiService.findById(wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }
    if (wiki.status !== targetStatus) {
      throw new HttpException(
        targetStatus === WikiStatus.private
          ? '私有知识库，无法查看内容'
          : '公共知识库，无法查看内容，请提 issue 到 GitHub 仓库反馈',
        HttpStatus.FORBIDDEN
      );
    }

    return true;
  }
}
