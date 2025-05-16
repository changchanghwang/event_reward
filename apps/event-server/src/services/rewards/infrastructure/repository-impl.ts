import { Injectable } from '@nestjs/common';
import { FindCondition, RewardRepository } from './repository';
import { Reward } from '../domain/model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { conflict, internalServerError } from '@libs/exceptions';
import { Repository } from '@libs/ddd/repository';

@Injectable()
export class RewardRepositoryImpl
  extends Repository
  implements RewardRepository
{
  constructor(
    @InjectModel(Reward.name) private readonly rewardModel: Model<Reward>,
  ) {
    super();
  }

  async save(rewards: Reward[]): Promise<void> {
    try {
      await this.rewardModel.insertMany(rewards);
    } catch (e) {
      if (e.message.includes('duplicate key error')) {
        throw conflict('Reward already exists', {
          errorMessage: '리워드가 이미 존재합니다.',
        });
      }
      throw internalServerError(`Failed to save reward: ${e.message}`, {
        errorMessage:
          '알수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      });
    }
  }

  async find(
    conditions: FindCondition,
    options?: { limit: number; page: number },
  ): Promise<Reward[]> {
    const { eventId } = conditions;

    const rewards = this.rewardModel.find({
      ...this.strip({ eventId }),
    });

    if (options) {
      const { limit, page } = options;
      rewards.skip((page - 1) * limit).limit(limit);
    }

    return (await rewards.exec()).map((reward) => new Reward(reward));
  }

  async count(conditions: FindCondition): Promise<number> {
    const { eventId } = conditions;

    return this.rewardModel
      .countDocuments({
        ...this.strip({ eventId }),
      })
      .exec();
  }
}
