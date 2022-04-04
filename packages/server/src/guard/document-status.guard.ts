import { CanActivate, ExecutionContext, Injectable, SetMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentStatus } from '@think/domains';
import { DocumentService } from '@services/document.service';

const KEY = 'DocumentStatus';
export const CheckDocumentStatus = (status: DocumentStatus) => SetMetadata(KEY, status);

@Injectable()
export class DocumentStatusGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly documentService: DocumentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targetStatus = this.reflector.get<DocumentStatus>(KEY, context.getHandler());

    if (!targetStatus) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { params, query, body } = request;
    const documentId = params.id || params.documentId || query.id || query.documentId || body.documentId;

    let document = null;

    if (documentId) {
      document = await this.documentService.findById(documentId);
    } else {
      if (body.wikiId) {
        document = await this.documentService.findWikiHomeDocument(body.wikiId);
      }
    }

    if (!document) {
      throw new HttpException('文档不存在', HttpStatus.NOT_FOUND);
    }

    if (document.status !== targetStatus) {
      throw new HttpException(
        targetStatus === DocumentStatus.private
          ? '私有文档，无法查看内容'
          : '公共文档，无法查看内容，请提 issue 到 GitHub 仓库反馈',
        HttpStatus.FORBIDDEN
      );
    }

    return true;
  }
}
