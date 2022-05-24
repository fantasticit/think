import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentService } from '@services/document.service';
import { DocumentStatus } from '@think/domains';

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
    const documentId = params?.id || params?.documentId || query?.id || query?.documentId || body?.documentId;

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
      throw new HttpException('私有文档，无法查看内容', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
