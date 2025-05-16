import { Inject, Injectable } from '@nestjs/common';
import { RegisterCommand } from '../commands';
import { RewardRequest } from '../domain/model';
import { RewardRequestRepository } from '../infrastructure/repository';
import { RewardRepository } from '@services/rewards/infrastructure/repository';
import { EventRepository } from '@services/events/infrastructure/repository';
import { badRequest } from '@libs/exceptions';

@Injectable()
export class RewardRequestService {
  constructor(
    @Inject('RewardRequestRepository')
    private readonly rewardRequestRepository: RewardRequestRepository,
    @Inject('EventRepository')
    private readonly eventRepository: EventRepository,
    @Inject('RewardRepository')
    private readonly rewardRepository: RewardRepository,
  ) {}

  async register(registerCommand: RegisterCommand): Promise<RewardRequest> {
    const [event, reward] = await Promise.all([
      this.eventRepository.findOneOrFail(registerCommand.eventId),
      this.rewardRepository.findOneOrFail(registerCommand.rewardId),
    ]);

    // <<- TODO: move validation logic to domain service
    if (!event.canRewardEligible) {
      throw badRequest(`Event(${event.id}) is not eligible for reward.`, {
        errorMessage: '진행된 이벤트가 아닙니다.',
      });
    }

    const [existRewardRequest] = await this.rewardRequestRepository.find({
      userId: registerCommand.userId,
      eventId: event.id,
      rewardId: reward.id,
    });

    if (!!existRewardRequest) {
      throw badRequest(`Reward request already exists.`, {
        errorMessage: '이미 리워드 요청이 존재합니다.',
      });
    }
    //TODO: manual reward가 아니라면 조건 충족 확인

    // ->>

    const rewardRequest = RewardRequest.from({
      userId: registerCommand.userId,
      eventId: event.id,
      rewardId: reward.id,
    });

    await this.rewardRequestRepository.save([rewardRequest]);

    return rewardRequest;
  }
}
