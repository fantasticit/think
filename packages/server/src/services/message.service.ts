import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutUser } from '@services/user.service';
import { MessageEntity } from '@entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
  ) {}

  /**
   * 新消息通知
   * @param user
   * @param msg
   * @returns
   */
  async notify(user: OutUser, msg) {
    const data = { userId: user.id, ...msg };
    const res = await this.messageRepo.create(data);
    const ret = await this.messageRepo.save(res);
    return ret;
  }

  /**
   * 获取用户所有消息
   * @param user
   * @param queryParams
   * @returns
   */
  async getAllMessages(user, queryParams) {
    const query = this.messageRepo
      .createQueryBuilder('comment')
      .where('comment.userId=:userId')
      .orderBy('comment.createdAt', 'DESC')
      .setParameter('userId', user.id);

    const { page = 1, pageSize = 6 } = queryParams;
    query.skip((+page - 1) * +pageSize);
    query.take(+pageSize);
    const [data, count] = await query.getManyAndCount();

    return { data, total: count };
  }

  /**
   * 获取消息通知
   * @param user
   * @param read 是否已读
   * @param queryParams
   * @returns
   */
  async getMessages(user, read, queryParams) {
    const query = this.messageRepo
      .createQueryBuilder('comment')
      .where('comment.userId=:userId')
      .andWhere('comment.read=:read')
      .orderBy('comment.createdAt', 'DESC')
      .setParameter('userId', user.id)
      .setParameter('read', read);

    const { page = 1, pageSize = 6 } = queryParams;
    query.skip((+page - 1) * +pageSize);
    query.take(+pageSize);
    const [data, count] = await query.getManyAndCount();

    return { data, total: count };
  }

  /**
   * 已读消息
   * @param user
   * @param messageId
   * @returns
   */
  async readMessage(user, messageId) {
    const msg = await this.messageRepo.findOne(messageId);

    if (user.id !== msg.userId) {
      throw new HttpException('您不是该消息用户', HttpStatus.FORBIDDEN);
    }

    const newData = await this.messageRepo.merge(msg, { read: true });
    return this.messageRepo.save(newData);
  }
}
