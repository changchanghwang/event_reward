import { Inject, Injectable } from '@nestjs/common';
import { RegisterCommand, ListCommand } from '../commands';
import { Reward } from '../domain/model';
import { RewardRepository } from '../infrastructure/repository';
import { RegisterRewardValidator } from '../domain/services';

@Injectable()
export class RewardService {
  constructor(
    @Inject('RewardRepository')
    private readonly rewardRepository: RewardRepository,
    private readonly registerRewardValidator: RegisterRewardValidator,
  ) {}

  async register(registerCommand: RegisterCommand): Promise<Reward> {
    const reward = await Reward.from({
      type: registerCommand.type,
      amount: registerCommand.amount,
      eventId: registerCommand.eventId,
      referenceId: registerCommand.referenceId,
      registerValidator: this.registerRewardValidator,
    });

    await this.rewardRepository.save([reward]);

    return reward;
  }

  async list(listCommand: ListCommand): Promise<Paginated<Reward>> {
    const { eventId, page, limit } = listCommand;

    const [rewards, count] = await Promise.all([
      this.rewardRepository.find({ eventId }, { page, limit }),
      this.rewardRepository.count({ eventId }),
    ]);

    return {
      items: rewards,
      count,
    };
  }
}
