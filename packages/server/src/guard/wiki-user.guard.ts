import { CanActivate, ExecutionContext, Injectable, SetMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IUser, WikiUserRole } from '@think/domains';
import { WikiService } from '@services/wiki.service';

const KEY = 'WIKI_USER_ROLE';

/**
 * 知识库成员角色检测
 * @param role 不传意味只要是成员即可
 * @returns
 */
export const CheckWikiUserRole = (role: WikiUserRole | null = null) => SetMetadata(KEY, role);

@Injectable()
export class WikiUserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly wikiService: WikiService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targetUserRole = this.reflector.get<WikiUserRole | null>(KEY, context.getHandler());

    const request = context.switchToHttp().getRequest();

    let token = request.headers.authorization;

    if (/Bearer/.test(token)) {
      token = token.split(' ').pop();
    }

    const user = this.jwtService.decode(token) as IUser;

    const { params, query, body } = request;
    const wikiId = params.id || params.wikiId || query.id || query.wikiId || body.wikiId;

    const wiki = await this.wikiService.findById(wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }

    const wikiUser = await this.wikiService.findWikiUser(wikiId, user.id);

    if (!wikiUser && targetUserRole && wikiUser.userRole !== targetUserRole) {
      throw new HttpException('您无权操作该知识库', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
