import { Inject, Injectable } from '@nestjs/common';
import { RewardRepository } from '@services/rewards/infrastructure/repository';
import { EventRepository } from '@services/events/infrastructure/repository';
import {
  ApproveCommand,
  ListCommand,
  RegisterCommand,
  RejectCommand,
} from '../commands';
import { RewardRequest, type RewardRequestStatus } from '../domain/model';
import { RewardRequestValidator } from '../domain/services';
import { RewardRequestRepository } from '../infrastructure/repository';
import { type User, UserRole } from '@services/external/domain/type';
import { ActivityRepository } from '@services/activities/infrastructure/repository';
import { groupBy } from 'lodash';

type RewardRequestOutput = {
  fulfilled: number;
  id: string;
  status: RewardRequestStatus;
  userId: string;
  eventId: string;
  rewardId: string;
  requestedAt: Date;
  transitAt?: Date;
};
@Injectable()
export class RewardRequestService {
  constructor(
    @Inject('RewardRequestRepository')
    private readonly rewardRequestRepository: RewardRequestRepository,
    @Inject('EventRepository')
    private readonly eventRepository: EventRepository,
    @Inject('RewardRepository')
    private readonly rewardRepository: RewardRepository,
    private readonly rewardRequestValidator: RewardRequestValidator,
    @Inject('ActivityRepository')
    private readonly activityRepository: ActivityRepository,
  ) {}

  async register(registerCommand: RegisterCommand): Promise<RewardRequest> {
    const [event, reward] = await Promise.all([
      this.eventRepository.findOneOrFail(registerCommand.eventId),
      this.rewardRepository.findOneOrFail(registerCommand.rewardId),
    ]);

    const rewardRequestStatus = await this.rewardRequestValidator.validate({
      userId: registerCommand.userId,
      event,
      reward,
    });

    const rewardRequest = RewardRequest.from({
      userId: registerCommand.userId,
      eventId: event.id,
      rewardId: reward.id,
      status: rewardRequestStatus,
    });

    await this.rewardRequestRepository.save([rewardRequest]);

    return rewardRequest;
  }

  async list(
    listCommand: ListCommand,
    user: User,
  ): Promise<Paginated<RewardRequestOutput>> {
    const { userId, eventId, status, page, limit } = listCommand;

    const [rewardRequests, count] = await Promise.all([
      this.rewardRequestRepository.find(
        {
          userId: user.role === UserRole.USER ? user.id : userId,
          eventId,
          status,
        },
        { limit, page },
      ),
      this.rewardRequestRepository.count({
        userId: user.role === UserRole.USER ? user.id : userId,
        eventId,
        status,
      }),
    ]);

    const activities = await this.activityRepository.find({
      eventIds: rewardRequests.map((rewardRequest) => rewardRequest.eventId),
      userId: user.role === UserRole.USER ? user.id : userId,
    });

    const activitiesGroupBy = groupBy(
      activities,
      (activity) => `${activity.eventId}-${activity.userId}`,
    );

    const rewardRequestsWithActivities = rewardRequests.map((rewardRequest) => {
      const activities =
        activitiesGroupBy[`${rewardRequest.eventId}-${rewardRequest.userId}`];
      return {
        ...rewardRequest,
        fulfilled: activities?.length ?? 0,
      };
    });

    return {
      items: rewardRequestsWithActivities,
      count,
    };
  }

  async approve(approveCommand: ApproveCommand): Promise<RewardRequest> {
    const rewardRequest = await this.rewardRequestRepository.findOneOrFail(
      approveCommand.id,
    );

    rewardRequest.approve();

    await this.rewardRequestRepository.save([rewardRequest]);

    return rewardRequest;
  }

  async reject(rejectCommand: RejectCommand): Promise<RewardRequest> {
    const rewardRequest = await this.rewardRequestRepository.findOneOrFail(
      rejectCommand.id,
    );

    rewardRequest.reject();

    await this.rewardRequestRepository.save([rewardRequest]);

    return rewardRequest;
  }
}
