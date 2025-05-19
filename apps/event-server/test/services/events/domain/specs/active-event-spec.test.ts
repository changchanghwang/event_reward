import { EventRepositoryImpl } from '@services/events/infrastructure/repository-impl';
import { Event, EventStatus, EventType } from '@services/events/domain/model';
import { Model } from 'mongoose';
import { ActiveEventSpec } from '@services/events/domain/specs/active-event-spec';

jest.mock('@services/events/infrastructure/repository-impl');

describe('ActiveEventSpec Test', () => {
  const eventRepository = jest.mocked(
    new EventRepositoryImpl({} as Model<Event>),
  );

  test('진행중인 이벤트를 조회해야 한다.', async () => {
    const spec = new ActiveEventSpec({
      type: EventType.ATTENDANCE,
    });

    const events = await spec.findSatisfiedElementsFrom(eventRepository);

    expect(eventRepository.find).toHaveBeenCalledWith({
      type: EventType.ATTENDANCE,
      status: EventStatus.PROCESSING,
    });
  });
});
