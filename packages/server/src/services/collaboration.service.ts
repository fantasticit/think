import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { DocumentStatus } from '@think/share';
import { getConfig } from '@think/config';
import * as Y from 'yjs';
import { TiptapTransformer } from '@hocuspocus/transformer';
import {
  Server,
  onAuthenticatePayload,
  onChangePayload,
  onLoadDocumentPayload,
} from '@hocuspocus/server';
import * as lodash from 'lodash';
import { OutUser, UserService } from '@services/user.service';
import { TemplateService } from '@services/template.service';
import { DocumentService } from '@services/document.service';

@Injectable()
export class CollaborationService {
  server: typeof Server;
  debounceTime: 2000;
  maxDebounceTime: 10000;
  timers: Map<
    string,
    {
      timeout: NodeJS.Timeout;
      start: number;
    }
  > = new Map();

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService,
    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,
  ) {
    this.initServer();
  }

  debounce(id: string, func: () => void, immediately = false) {
    const old = this.timers.get(id);
    const start = old?.start || Date.now();

    const run = () => {
      this.timers.delete(id);
      func();
    };

    if (old?.timeout) {
      clearTimeout(old.timeout);
    }

    if (immediately) {
      return run();
    }

    if (Date.now() - start >= this.maxDebounceTime) {
      return run();
    }

    this.timers.set(id, {
      start,
      timeout: setTimeout(run, this.debounceTime),
    });
  }

  private async initServer() {
    const server = Server.configure({
      onAuthenticate: this.onAuthenticate.bind(this),
      onLoadDocument: this.onLoadDocument.bind(this),
      onChange: this.onChange.bind(this),
    });
    this.server = server;
    this.server.listen(
      lodash.get(getConfig(), 'server.collaborationPort', 5003),
    );
  }

  async onAuthenticate({
    connection,
    token,
    requestParameters,
  }: onAuthenticatePayload) {
    const targetId = requestParameters.get('targetId');
    const docType = requestParameters.get('docType');

    switch (docType) {
      case 'document': {
        const documentId = targetId;
        if (token === 'anoy') {
          const document = await this.documentService.findById(documentId);
          if (document.status === DocumentStatus.public) {
            connection.readOnly = true;
            return {
              user: { name: 'anoymouse' },
            };
          }
        } else {
          const user = await this.userService.decodeToken(token);

          if (!user || !user.id) {
            throw new HttpException(
              '您无权查看此文档',
              HttpStatus.UNAUTHORIZED,
            );
          }

          const authority = await this.documentService.getDocumentAuthority(
            documentId,
            user.id,
          );

          if (!authority.readable) {
            throw new HttpException('您无权查看此文档', HttpStatus.FORBIDDEN);
          }

          if (!authority.editable) {
            connection.readOnly = true;
          }

          return {
            user,
          };
        }
        break;
      }

      case 'template': {
        const templateId = targetId;

        const user = await this.userService.decodeToken(token);

        if (!user || !user.id) {
          throw new HttpException('您无权查看此模板', HttpStatus.UNAUTHORIZED);
        }

        const template = await this.templateService.findById(templateId);

        if (template.createUserId !== user.id) {
          throw new HttpException('您无权查看此模板', HttpStatus.FORBIDDEN);
        }

        return {
          user,
        };
      }

      default:
        throw new Error('未知类型');
    }
  }

  /**
   * 创建文档
   * @param data
   * @returns
   */
  async onLoadDocument(data: onLoadDocumentPayload) {
    const { requestParameters, document } = data;
    const targetId = requestParameters.get('targetId');
    const docType = requestParameters.get('docType');

    switch (docType) {
      case 'document': {
        const documentId = targetId;
        const { state } = await this.documentService.findById(documentId);
        const unit8 = new Uint8Array(state);

        if (unit8.byteLength) {
          Y.applyUpdate(document, unit8);
        }

        return document;
      }

      case 'template': {
        const templateId = targetId;
        const { state } = await this.templateService.findById(templateId);
        const unit8 = new Uint8Array(state);

        if (unit8.byteLength) {
          Y.applyUpdate(document, unit8);
        }

        return document;
      }

      default:
        throw new Error('未知类型');
    }
  }

  async onChange(data: onChangePayload) {
    const { requestParameters } = data;

    const targetId = requestParameters.get('targetId');
    const docType = requestParameters.get('docType');

    const updateHandler =
      docType === 'document'
        ? this.documentService.updateDocument.bind(this.documentService)
        : this.templateService.updateTemplate.bind(this.templateService);

    this.debounce(`onStoreDocument-${targetId}`, () => {
      this.onStoreDocument(updateHandler, data).catch((error) => {
        if (error?.message) {
          throw new HttpException(
            error?.message,
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }
      });
    });
  }

  async onStoreDocument(updateHandler, data: onChangePayload) {
    const { requestParameters, context } = data;
    const targetId = requestParameters.get('targetId');
    const userId = requestParameters.get('userId');

    if (!userId) {
      console.error('COLLABORATION: can not get user info');
      return;
    }

    const node = TiptapTransformer.fromYdoc(data.document);
    const title = lodash.get(node, `default.content[0].content[0].text`, '');
    const state = Buffer.from(Y.encodeStateAsUpdate(data.document));
    await updateHandler({ id: userId } as OutUser, targetId, {
      title,
      content: JSON.stringify(node),
      state,
    });
  }
}
