import { Event, EventStatus, EventType } from '@services/events/domain/model';
import { v7 } from 'uuid';

jest.mock('uuid');

describe('Event Model test', () => {
  describe('from test', () => {
    beforeEach(() => {
      const mockedUuid = v7 as jest.Mock<string>;
      mockedUuid.mockReturnValue('test-id');
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.useRealTimers();
    });

    test('event를 생성할 수 있다.', () => {
      const event = Event.from({
        type: EventType.ATTENDANCE,
        startAt: new Date('2025-06-01T09:00:00.000Z'),
        endAt: new Date('2025-06-30T09:00:00.000Z'),
      });

      expect(event).toEqual({
        id: 'test-id',
        type: EventType.ATTENDANCE,
        startAt: new Date('2025-06-01T09:00:00.000Z'),
        endAt: new Date('2025-06-30T09:00:00.000Z'),
        status: EventStatus.PENDING,
      });
    });

    test('startAt은 현재보다 과거일 수 없다.', () => {
      jest.setSystemTime(new Date('2025-05-15T00:00:00.000Z'));

      expect.assertions(2);
      try {
        Event.from({
          type: EventType.ATTENDANCE,
          startAt: new Date('2025-05-14T00:00:00.000Z'),
        });
      } catch (e) {
        expect(e.message).toBe('Start time must be in the future');
        expect(e.getResponse().errorMessage).toBe(
          '시작 시간은 현재 시간 이후여야 합니다.',
        );
      }
    });

    test('endAt은 현재보다 과거일 수 없다.', () => {
      jest.setSystemTime(new Date('2025-05-15T00:00:00.000Z'));

      expect.assertions(2);
      try {
        Event.from({
          type: EventType.ATTENDANCE,
          endAt: new Date('2025-05-14T00:00:00.000Z'),
        });
      } catch (e) {
        expect(e.message).toBe('End time must be in the future');
        expect(e.getResponse().errorMessage).toBe(
          '종료 시간은 현재 시간 이후여야 합니다.',
        );
      }
    });
  });
});
