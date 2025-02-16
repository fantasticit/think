import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AdDto } from '@dtos/ad.dto';
import { AdEntity } from '@entities/ad.entity';
import { UserEntity } from '@entities/user.entity';
import { Repository } from 'typeorm';

import { UserService } from './user.service';

@Injectable()
export class AdService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @InjectRepository(AdEntity)
    private readonly adRepo: Repository<AdEntity>
  ) {}

  private async check(user: UserEntity) {
    const currentUser = await this.userService.findById(user.id);

    if (!currentUser.isSystemAdmin) {
      throw new HttpException('您无权操作', HttpStatus.FORBIDDEN);
    }
  }

  async addAd(user: UserEntity, dto: AdDto) {
    await this.check(user);

    const data = await this.adRepo.create(dto);
    const res = await this.adRepo.save(data);
    return res;
  }

  async getAds() {
    const data = await this.adRepo.find();
    return data;
  }

  async deleteAd(user: UserEntity, id: string) {
    await this.check(user);

    return await this.adRepo.delete(id);
  }
}
