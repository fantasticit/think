import { CommentDto, UpdateCommentDto } from '@dtos/comment.dto';
import { CommentEntity } from '@entities/comment.entity';
import { parseUserAgent } from '@helpers/ua.helper';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentService } from '@services/document.service';
import { MessageService } from '@services/message.service';
import { OutUser, UserService } from '@services/user.service';
import { DocumentStatus } from '@think/domains';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
    private readonly userService: UserService,
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
  async create(user: OutUser, userAgent: string, dto: CommentDto) {
    const { documentId, html, replyUserId } = dto;

    const doc = await this.documentService.findById(documentId);

    if (doc.status !== DocumentStatus.public) {
      const docAuth = await this.documentService.getDocumentAuthority(documentId, user.id);

      if (!docAuth) {
        throw new HttpException('文档不存在', HttpStatus.NOT_FOUND);
      }

      if (!docAuth.readable) {
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

    const wikiUsersAuth = await this.documentService.getDocUsersWithoutAuthCheck(user, documentId);

    await Promise.all(
      wikiUsersAuth.map(async (userAuth) => {
        await this.messageService.notify(userAuth.user, {
          title: `文档「${doc.title}」收到新评论`,
          message: `文档「${doc.title}」收到新评论，快去看看！`,
          url: `/wiki/${doc.wikiId}/document/${doc.id}`,
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
    const wikiUsersAuth = await this.documentService.getDocUsersWithoutAuthCheck(user, old.documentId);

    await Promise.all(
      wikiUsersAuth.map(async (userAuth) => {
        await this.messageService.notify(userAuth.user, {
          title: `文档「${doc.title}」评论更新`,
          message: `文档「${doc.title}」的评论已更新，快去看看！`,
          url: `/wiki/${doc.wikiId}/document/${doc.id}`,
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
    const wikiUsersAuth = await this.documentService.getDocUsersWithoutAuthCheck(user, data.documentId);
    await Promise.all(
      wikiUsersAuth.map(async (userAuth) => {
        await this.messageService.notify(userAuth.user, {
          title: `文档「${doc.title}」的评论已被删除`,
          message: `文档「${doc.title}」的评论已被删除，快去看看`,
          url: `/wiki/${doc.wikiId}/document/${doc.id}`,
        });
      })
    );
    return this.commentRepo.remove(data);
  }
}
