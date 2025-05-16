import { badRequest } from '@libs/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { EventStatus } from '@services/events/domain/model';
import { EventRepository } from '@services/events/infrastructure/repository';

@Injectable()
export class RegisterRewardValidator {
  constructor(
    @Inject('EventRepository')
    private readonly eventRepository: EventRepository,
  ) {}

  async validate(eventId: string) {
    const event = await this.eventRepository.findOneOrFail(eventId);

    const registableStatuses = [EventStatus.SCHEDULED, EventStatus.PROCESSING];

    if (!registableStatuses.includes(event.status)) {
      throw badRequest(`Event status(${event.status}) is not registable`, {
        errorMessage:
          '보상은 이벤트가 예정, 또는 진행 중인 경우에만 등록할 수 있습니다.',
      });
    }
  }
}
