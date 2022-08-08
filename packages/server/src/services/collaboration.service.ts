import { onAuthenticatePayload, onChangePayload, onLoadDocumentPayload, Server } from '@hocuspocus/server';
import { TiptapTransformer } from '@hocuspocus/transformer';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentService } from '@services/document.service';
import { DocumentVersionService } from '@services/document-version.service';
import { TemplateService } from '@services/template.service';
import { UserService } from '@services/user.service';
import { DocumentStatus, IUser } from '@think/domains';
import * as lodash from 'lodash';
import * as Y from 'yjs';

export const findMentions = (content) => {
  const queue = [content];
  const res = [];

  while (queue.length) {
    const node = queue.shift();

    if (node.type === 'mention') {
      res.push(node.attrs.id);
    }

    if (node.content && node.content.length) {
      queue.push(...node.content);
    }
  }

  return res;
};

@Injectable()
export class CollaborationService {
  server: typeof Server;
  debounceTime = 1000;
  maxDebounceTime = 10000;
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

    @Inject(forwardRef(() => DocumentVersionService))
    private readonly documentVersionService: DocumentVersionService,

    @Inject(forwardRef(() => ConfigService))
    private readonly configService: ConfigService
  ) {
    this.initServer();
  }

  debounce(id: string, func: () => void, debounceTime = this.debounceTime, immediately = false) {
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
      timeout: setTimeout(run, debounceTime),
    });
  }

  private async initServer() {
    try {
      const server = Server.configure({
        quiet: true,
        onAuthenticate: this.onAuthenticate.bind(this),
        onLoadDocument: this.onLoadDocument.bind(this),
        onChange: this.onChange.bind(this),
        onDisconnect: this.onDisconnect.bind(this),
      });
      this.server = server;
      const port = this.configService.get('server.collaborationPort') || 5003;
      await this.server.listen(port);
      console.log(`[think] 协作服务启动成功，端口：${port}`);
    } catch (err) {
      console.error('[think] 协作服务启动失败：', err.message);
    }
  }

  async onAuthenticate({ connection, token, requestParameters }: onAuthenticatePayload) {
    const targetId = requestParameters.get('targetId');
    const docType = requestParameters.get('docType');
    const userId = requestParameters.get('userId');

    const user = token ? await this.userService.decodeToken(token) : null;

    switch (docType) {
      case 'document': {
        if (!user) {
          const document = await this.documentService.findById(targetId);
          if (!document || document.status !== DocumentStatus.public) {
            throw new HttpException('您无权查看此文档', HttpStatus.FORBIDDEN);
          }
          connection.readOnly = true;
          return { user: { name: '匿名用户' } };
        } else {
          if (user.id !== userId) {
            throw new HttpException('用户信息不匹配', HttpStatus.FORBIDDEN);
          }

          const authority = await this.documentService.getDocumentUserAuth(user.id, targetId);

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
      }

      case 'template': {
        if (!user || !user.id) {
          throw new HttpException('您无权查看', HttpStatus.UNAUTHORIZED);
        }

        const template = await this.templateService.findById(targetId);

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

    let state = null;

    switch (docType) {
      case 'document': {
        const res = await this.documentService.findById(targetId);
        if (!res) {
          throw new Error('文档不存在');
        }
        state = res.state;
        break;
      }

      case 'template': {
        const res = await this.templateService.findById(targetId);
        state = res.state;
        break;
      }

      default:
        throw new Error('未知类型');
    }

    const unit8 = new Uint8Array(state);

    if (unit8.byteLength) {
      Y.applyUpdate(document, unit8);
    }

    return document;
  }

  async onChange(data: onChangePayload) {
    const { requestParameters } = data;

    const targetId = requestParameters.get('targetId');
    const docType = requestParameters.get('docType');
    const userId = requestParameters.get('userId');

    const updateDocument = async (user: IUser, documentId: string, data) => {
      await this.documentService.updateDocument(user, documentId, data);
      this.debounce(
        `onStoreDocumentVersion-${documentId}`,
        () => {
          this.documentVersionService.storeDocumentVersion({
            documentId,
            data: data.content,
            userId,
          });
        },
        this.debounceTime * 2
      );
    };
    const updateTemplate = this.templateService.updateTemplate.bind(this.templateService);

    const updateHandler = docType === 'document' ? updateDocument : updateTemplate;

    this.debounce(`onStoreDocument-${targetId}`, () => {
      this.onStoreDocument(updateHandler, data).catch((error) => {
        if (error?.message) {
          throw new HttpException(error?.message, HttpStatus.SERVICE_UNAVAILABLE);
        }
      });
    });
  }

  async onStoreDocument(updateHandler, data: onChangePayload) {
    const { requestParameters } = data;
    const targetId = requestParameters.get('targetId');
    const userId = requestParameters.get('userId');

    if (!userId) {
      throw new HttpException('无用户信息，拒绝存储文档数据变更', HttpStatus.FORBIDDEN);
    }

    const node = TiptapTransformer.fromYdoc(data.document);
    const title = lodash.get(node, `default.content[0].content[0].text`, '').replace(/\s/g, '').slice(0, 255);
    const state = Buffer.from(Y.encodeStateAsUpdate(data.document));
    await updateHandler({ id: userId } as IUser, targetId, {
      title,
      content: JSON.stringify(node),
      state,
    });
  }

  async onDisconnect(data) {
    const { requestParameters } = data;
    const targetId = requestParameters.get('targetId');
    const docType = requestParameters.get('docType');
    const userId = requestParameters.get('userId');
    const editable = requestParameters.get('editable');

    if (docType === 'document') {
      const data = await this.documentService.findById(targetId);

      if (data && !data.title) {
        await this.documentService.updateDocument({ id: userId } as IUser, targetId, {
          title: '未命名文档',
        });
      }

      if (data && editable) {
        const content = data.content;
        const json = JSON.parse(content).default;
        const mentionUsers = findMentions(json);
        this.documentService.notifyMentionUsers(targetId, mentionUsers);
      }

      return;
    }

    if (docType === 'template') {
      const data = await this.templateService.findById(targetId);
      if (data && !data.title) {
        await this.templateService.updateTemplate({ id: userId } as IUser, targetId, {
          title: '未命名模板',
        });
      }
      return;
    }
  }
}
