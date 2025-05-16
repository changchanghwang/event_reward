import { Inject, Injectable } from '@nestjs/common';
import { RewardRequestRepository } from '@services/reward-requests/infrastructure/repository';
import { badRequest } from '@libs/exceptions';
import { Reward } from '@services/rewards/domain/model';
import { Event } from '@services/events/domain/model';
import { RewardRequestStatus } from '@services/reward-requests/domain/model';

@Injectable()
export class RewardRequestValidator {
  constructor(
    @Inject('RewardRequestRepository')
    private readonly rewardRequestRepository: RewardRequestRepository,
  ) {}

  async validate({
    userId,
    event,
    reward,
  }: {
    userId: string;
    event: Event;
    reward: Reward;
  }) {
    if (!event.canRewardEligible) {
      throw badRequest(`Event(${event.id}) is not eligible for reward.`, {
        errorMessage: '진행된 이벤트가 아닙니다.',
      });
    }

    const [existRewardRequest] = await this.rewardRequestRepository.find({
      userId: userId,
      eventId: event.id,
      rewardId: reward.id,
    });

    if (!!existRewardRequest) {
      throw badRequest(`Reward request already exists.`, {
        errorMessage: '이미 리워드 요청이 존재합니다.',
      });
    }

    return reward.isManual
      ? RewardRequestStatus.REQUESTED
      : this.evaluateRewardRequestState();
  }

  // TODO: participant 조회 후 조건 충족 확인
  private evaluateRewardRequestState() {
    return RewardRequestStatus.REQUESTED;
  }
}
