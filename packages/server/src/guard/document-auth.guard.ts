// import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, SetMetadata } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
// import { DocumentService } from '@services/document.service';
// import { IUser } from '@think/domains';

// const KEY = 'DocumentAuthority';
// export const CheckDocumentAuthority = (auth: 'readable' | 'editable' | 'createUser' | null) => SetMetadata(KEY, auth);

// @Injectable()
// export class DocumentAuthorityGuard implements CanActivate {
//   constructor(
//     private readonly reflector: Reflector,
//     private readonly jwtService: JwtService,
//     private readonly documentService: DocumentService
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const needAuth = this.reflector.get<string>(KEY, context.getHandler());

//     if (!needAuth) {
//       return true;
//     }

//     const request = context.switchToHttp().getRequest();
//     const token = request?.cookies['token'];
//     const user = this.jwtService.decode(token) as IUser;
//     const { params, query, body } = request;
//     const documentId = params?.id || params?.documentId || query?.id || query?.documentId || body?.documentId;

//     let document = null;

//     if (documentId) {
//       document = await this.documentService.findById(documentId);
//     } else {
//       if (body.wikiId) {
//         document = await this.documentService.findWikiHomeDocument(body.wikiId);
//       }
//     }

//     if (!document) {
//       throw new HttpException('文档不存在', HttpStatus.NOT_FOUND);
//     }

//     if (needAuth === 'createUser') {
//       if (document.createUserId !== user.id) {
//         throw new HttpException('您不是该文档的创建者，无法操作', HttpStatus.FORBIDDEN);
//       }
//     } else if (needAuth) {
//       if (!user) {
//         throw new HttpException('请登录后使用', HttpStatus.UNAUTHORIZED);
//       }
//       const authority = await this.documentService.getDocumentAuthority(documentId, user.id);
//       if (!authority || !authority[needAuth]) {
//         throw new HttpException('您无权操作此文档', HttpStatus.FORBIDDEN);
//       }
//     }

//     return true;
//   }
// }
