import { CommentDto, UpdateCommentDto } from '@dtos/comment.dto';
import { CommentEntity } from '@entities/comment.entity';
import { parseUserAgent } from '@helpers/ua.helper';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '@services/auth.service';
import { DocumentService } from '@services/document.service';
import { MessageService } from '@services/message.service';
import { UserService } from '@services/user.service';
import { AuthEnum, buildMessageURL, DocumentStatus, IUser } from '@think/domains';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,

    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService
  ) {}

  /**
   * 获取指定评论
   * @param id
   */
  async findById(id) {
    return this.commentRepo.findOne(id);
  }

  /**
   * 获取一组评论
   * @param ids
   * @returns
   */
  async findByIds(ids) {
    return this.commentRepo.findByIds(ids);
  }

  /**
   *
   * @param user 创建评论
   * @param userAgent
   * @param dto
   * @returns
   */
  async create(user: IUser, userAgent: string, dto: CommentDto) {
    const { documentId, html, replyUserId } = dto;

    const doc = await this.documentService.findById(documentId);

    if (doc.status !== DocumentStatus.public) {
      const authority = await this.documentService.getDocumentUserAuth(user.id, documentId);

      if (!authority) {
        throw new HttpException('文档不存在', HttpStatus.NOT_FOUND);
      }
      if (!authority.readable) {
        throw new HttpException('权限不足，无法评论', HttpStatus.FORBIDDEN);
      }
    }

    const { text: uaText } = parseUserAgent(userAgent);

    const comment = {
      documentId,
      parentCommentId: dto.parentCommentId,
      createUserId: user.id,
      html,
      replyUserId,
      userAgent: uaText,
    };

    const res = await this.commentRepo.create(comment);
    const ret = await this.commentRepo.save(res);

    const { data: users } = await this.authService.getUsersAuthInDocument(doc.organizationId, doc.wikiId, doc.id, null);

    await Promise.all(
      users
        .filter((user) => user.auth !== AuthEnum.noAccess)
        .map((user) => {
          this.messageService.notify(user.userId, {
            title: `文档「${doc.title}」收到新评论`,
            message: `文档「${doc.title}」收到新评论，快去看看！`,
            url: buildMessageURL('toDocument')({
              organizationId: doc.organizationId,
              wikiId: doc.wikiId,
              documentId: doc.id,
            }),
            uniqueId: ret.id,
          });
        })
    );

    return ret;
  }

  /**
   * 获取文档评论
   * @param documentId
   * @param queryParams
   */
  async getDocumentComments(user, documentId, queryParams) {
    const hasLogin = user ? !!(await this.userService.validateUser(user)) : false;

    const query = this.commentRepo
      .createQueryBuilder('comment')
      .where('comment.documentId=:documentId')
      .andWhere('comment.pass=:pass')
      .andWhere('comment.parentCommentId is NULL')
      .orderBy('comment.createdAt', 'DESC')
      .setParameter('documentId', documentId)
      .setParameter('pass', true);

    const subQuery = this.commentRepo
      .createQueryBuilder('comment')
      .andWhere('comment.pass=:pass')
      .andWhere('comment.parentCommentId=:parentCommentId')
      .orderBy('comment.createdAt', 'ASC')
      .setParameter('pass', true);

    const { page = 1, pageSize = 12 } = queryParams;
    query.skip((+page - 1) * +pageSize);
    query.take(+pageSize);
    const [data, count] = await query.getManyAndCount();

    const getCreateUser = async (comment) => {
      try {
        if (hasLogin) {
          const createUser = await this.userService.findById(comment.createUserId);
          comment.createUser = createUser;
        } else {
          comment.createUser = {
            id: comment.createUserId,
            name: `用户${comment.createUserId.split('-').shift()}`,
            role: 'normal',
            status: 'normal',
          };
        }
      } catch (e) {
        console.log('error', e);
        comment.createUser = null;
      }
    };

    const getChildren = async (data) => {
      for (const item of data) {
        getCreateUser(item);

        const subComments = await subQuery.setParameter('parentCommentId', item.id).getMany();

        await Promise.all(
          subComments.map(async (sub) => {
            await getCreateUser(sub);
            return sub;
          })
        );

        await getChildren(subComments);

        Object.assign(item, { children: subComments });
      }
    };

    await getChildren(data);

    return { data, total: count };
  }

  /**
   * 更新评论
   * @param id
   * @param tag
   */
  async updateComment(user, dto: UpdateCommentDto) {
    const old = await this.commentRepo.findOne(dto.id);

    if (user.id !== old.createUserId) {
      throw new HttpException('您不是评论创建者，无法编辑', HttpStatus.FORBIDDEN);
    }

    const newData = await this.commentRepo.merge(old, { html: dto.html });

    const doc = await this.documentService.findById(old.documentId);

    const { data: users } = await this.authService.getUsersAuthInDocument(doc.organizationId, doc.wikiId, doc.id, null);

    await Promise.all(
      users
        .filter((user) => user.auth !== AuthEnum.noAccess)
        .map((user) => {
          this.messageService.notify(user.userId, {
            title: `文档「${doc.title}」收到新评论`,
            message: `文档「${doc.title}」收到新评论，快去看看！`,
            url: buildMessageURL('toDocument')({
              organizationId: doc.organizationId,
              wikiId: doc.wikiId,
              documentId: doc.id,
            }),
            uniqueId: newData.id,
          });
        })
    );

    return this.commentRepo.save(newData);
  }

  async deleteComment(user, id) {
    const data = await this.commentRepo.findOne(id);
    if (user.id !== data.createUserId) {
      throw new HttpException('您不是评论创建者，无法删除', HttpStatus.FORBIDDEN);
    }
    const doc = await this.documentService.findById(data.documentId);

    const { data: users } = await this.authService.getUsersAuthInDocument(doc.organizationId, doc.wikiId, doc.id, null);

    await Promise.all(
      users
        .filter((user) => user.auth !== AuthEnum.noAccess)
        .map((user) => {
          this.messageService.notify(user.userId, {
            title: `文档「${doc.title}」收到新评论`,
            message: `文档「${doc.title}」收到新评论，快去看看！`,
            url: buildMessageURL('toDocument')({
              organizationId: doc.organizationId,
              wikiId: doc.wikiId,
              documentId: doc.id,
            }),
            uniqueId: data.id,
          });
        })
    );

    return this.commentRepo.remove(data);
  }
}
