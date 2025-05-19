import { FindOption } from '@libs/db';
import { EventSpec } from '@services/events/domain/specs/event-spec';
import { EventRepository } from '@services/events/infrastructure/repository';
import { Event, EventStatus, EventType } from '@services/events/domain/model';
import { notImplemented } from '@libs/exceptions';

export class ActiveEventSpec implements EventSpec {
  private type: EventType;

  private startAtPeriod?: {
    from?: Date;
    to?: Date;
  };

  private endAtPeriod?: {
    from?: Date;
    to?: Date;
  };

  constructor(args: {
    type: EventType;
    startAtPeriod?: {
      from?: Date;
      to?: Date;
    };
    endAtPeriod?: {
      from?: Date;
      to?: Date;
    };
  }) {
    this.type = args.type;
    this.startAtPeriod = args.startAtPeriod;
    this.endAtPeriod = args.endAtPeriod;
  }

  findSatisfiedElementsFrom(
    repository: EventRepository,
    options?: FindOption,
  ): Promise<Event[]> {
    return repository.find({
      type: this.type,
      status: EventStatus.PROCESSING,
      startAtPeriod: this.startAtPeriod,
      endAtPeriod: this.endAtPeriod,
    });
  }
  countSatisfiedElementsFrom(repository: EventRepository): Promise<number> {
    throw notImplemented(
      `${this.constructor.name}.countSatisfiedElementsFrom is not implemented.`,
      {
        errorMessage: '오류가 발생했습니다. 나중에 다시 시도해주세요.',
      },
    );
  }
}
