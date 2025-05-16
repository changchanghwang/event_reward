import { Injectable } from '@nestjs/common';
import { FindCondition, RewardRequestRepository } from './repository';
import { RewardRequest } from '../domain/model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { conflict, internalServerError } from '@libs/exceptions';
import { Repository } from '@libs/ddd/repository';

@Injectable()
export class RewardRequestRepositoryImpl
  extends Repository
  implements RewardRequestRepository
{
  constructor(
    @InjectModel(RewardRequest.name)
    private readonly rewardRequestModel: Model<RewardRequest>,
  ) {
    super();
  }

  async save(rewards: RewardRequest[]): Promise<void> {
    try {
      await this.rewardRequestModel.insertMany(rewards);
    } catch (e) {
      if (e.message.includes('duplicate key error')) {
        throw conflict('Reward request already exists', {
          errorMessage: '리워드 요청이 이미 존재합니다.',
        });
      }
      throw internalServerError(`Failed to save reward request: ${e.message}`, {
        errorMessage:
          '알수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      });
    }
  }

  async find(
    conditions: FindCondition,
    options?: { limit: number; page: number },
  ): Promise<RewardRequest[]> {
    const rewardRequests = this.rewardRequestModel.find({
      ...this.strip(conditions),
    });

    if (options) {
      const { limit, page } = options;
      rewardRequests.skip((page - 1) * limit).limit(limit);
    }

    return (await rewardRequests.exec()).map(
      (rewardRequest) => new RewardRequest(rewardRequest),
    );
  }

  async count(conditions: FindCondition): Promise<number> {
    return this.rewardRequestModel
      .countDocuments({
        ...this.strip(conditions),
      })
      .exec();
  }
}
