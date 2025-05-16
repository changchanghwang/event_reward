import { Inject, Injectable } from '@nestjs/common';
import { RegisterCommand, ListCommand } from '../commands';
import { Reward } from '../domain/model';
import { RewardRepository } from '../infrastructure/repository';

@Injectable()
export class RewardService {
  constructor(
    @Inject('RewardRepository')
    private readonly rewardRepository: RewardRepository,
  ) {}

  async register(registerCommand: RegisterCommand): Promise<Reward> {
    const reward = Reward.from({
      type: registerCommand.type,
      amount: registerCommand.amount,
      eventId: registerCommand.eventId,
      referenceId: registerCommand.referenceId,
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
