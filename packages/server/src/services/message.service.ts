import { MessageEntity } from '@entities/message.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from '@think/domains';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { buildRedis } from '@helpers/redis.helper';
import { RedisDBEnum } from '@constants/*';
import { uniqueId } from 'lodash';

@Injectable()
export class MessageService {
  private redis: Redis;

  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>
  ) {
    this.buildRedis();
  }

  private async buildRedis() {
    try {
      this.redis = await buildRedis(RedisDBEnum.message);
      console.log('[think] 消息服务启动成功');
    } catch (e) {
      console.error(`[think] 消息服务启动错误: "${e.message}"`);
    }
  }

  /**
   * 新消息通知
   * @param user
   * @param msg
   * @returns
   */
  async notify(userId: IUser['id'], msg: { title: string; message: string; url: string; uniqueId: string | number }) {
    const key = `message-${userId}-${uniqueId}`;

    if (await this.redis.get(key)) {
      return;
    }

    const data = { userId, ...msg };
    await this.redis.set(key, Date.now(), 'EX', 5 * 60);
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
