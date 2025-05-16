import { Inject, Injectable } from '@nestjs/common';
import { RewardRepository } from '@services/rewards/infrastructure/repository';
import { EventRepository } from '@services/events/infrastructure/repository';
import { ApproveCommand, ListCommand, RegisterCommand } from '../commands';
import { RewardRequest } from '../domain/model';
import { RewardRequestValidator } from '../domain/services';
import { RewardRequestRepository } from '../infrastructure/repository';

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

  async list(listCommand: ListCommand): Promise<Paginated<RewardRequest>> {
    const { userId, eventId, status, page, limit } = listCommand;

    const [rewardRequests, count] = await Promise.all([
      this.rewardRequestRepository.find(
        { userId, eventId, status },
        { limit, page },
      ),
      this.rewardRequestRepository.count({
        userId,
        eventId,
        status,
      }),
    ]);

    return {
      items: rewardRequests,
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
}
