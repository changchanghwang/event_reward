import { Inject, Injectable } from '@nestjs/common';
import { RewardRequestRepository } from '@services/reward-requests/infrastructure/repository';
import { badRequest } from '@libs/exceptions';
import { Reward } from '@services/rewards/domain/model';
import { Event } from '@services/events/domain/model';
import { RewardRequestStatus } from '@services/reward-requests/domain/model';
import { ActivityRepository } from '@services/activities/infrastructure/repository';

@Injectable()
export class RewardRequestValidator {
  constructor(
    @Inject('RewardRequestRepository')
    private readonly rewardRequestRepository: RewardRequestRepository,
    @Inject('ActivityRepository')
    private readonly activityRepository: ActivityRepository,
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
    });

    if (!!existRewardRequest) {
      throw badRequest(`Reward request already exists.`, {
        errorMessage: '이미 리워드 요청이 존재합니다.',
      });
    }

    return reward.isManual
      ? RewardRequestStatus.REQUESTED
      : this.evaluateRewardRequestState(userId, event.id, reward);
  }

  private async evaluateRewardRequestState(
    userId: string,
    eventId: string,
    reward: Reward,
  ) {
    const activities = await this.activityRepository.find({
      userId: userId,
      eventIds: [eventId],
    });

    if (activities.length >= reward.required) {
      return RewardRequestStatus.APPROVED;
    }

    return RewardRequestStatus.REJECTED;
  }
}
