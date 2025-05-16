import { Inject, Injectable } from '@nestjs/common';
import { RegisterCommand } from '@services/rewards/commands/register';
import { Reward } from '@services/rewards/domain/model';
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
}
