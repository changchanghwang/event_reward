import { Event, EventStatus, EventType } from '@services/events/domain/model';
import { eventOf } from '@test';
import { v7 } from 'uuid';

jest.mock('uuid');

describe('Event Model test', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('from test', () => {
    beforeEach(() => {
      const mockedUuid = v7 as jest.Mock<string>;
      mockedUuid.mockReturnValue('test-id');
    });

    afterEach(() => {
      jest.clearAllMocks();
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
        status: EventStatus.SCHEDULED,
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

  describe('start test', () => {
    test('event를 시작할 수 있다.', () => {
      const now = new Date('2025-05-15T00:00:00.000Z');
      jest.setSystemTime(now);

      const event = eventOf({
        type: EventType.ATTENDANCE,
      });

      event.start();

      expect(event.status).toBe(EventStatus.PROCESSING);
      expect(event.transitAt).toEqual(now);
    });

    test.each(
      Object.values(EventStatus).filter(
        (status) => status !== EventStatus.SCHEDULED,
      ),
    )('SCHEDULED 상태의 이벤트가 아니라면 에러를 던진다.', (status) => {
      const event = eventOf({
        status,
      });

      expect.assertions(2);
      try {
        event.start();
      } catch (e) {
        expect(e.message).toBe('Event is not SCHEDULED');
        expect(e.getResponse().errorMessage).toBe(
          '이벤트가 대기상태가 아닙니다.',
        );
      }
    });
  });

  describe('complete test', () => {
    test('event를 완료할 수 있다.', () => {
      const now = new Date('2025-05-15T00:00:00.000Z');
      jest.setSystemTime(now);

      const event = eventOf({
        status: EventStatus.PROCESSING,
      });

      event.complete();

      expect(event.status).toBe(EventStatus.COMPLETED);
      expect(event.endAt).toEqual(now);
    });

    test.each(
      Object.values(EventStatus).filter(
        (status) => status !== EventStatus.PROCESSING,
      ),
    )('PROCESSING 상태의 이벤트가 아니라면 에러를 던진다.', (status) => {
      const event = eventOf({ status });

      expect.assertions(2);
      try {
        event.complete();
      } catch (e) {
        expect(e.message).toBe('Event is not processing');
        expect(e.getResponse().errorMessage).toBe(
          '이벤트가 진행 중이 아닙니다.',
        );
      }
    });
  });

  describe('cancel test', () => {
    test('event를 취소할 수 있다.', () => {
      const event = eventOf({
        status: EventStatus.SCHEDULED,
      });

      event.cancel();

      expect(event.status).toBe(EventStatus.CANCELLED);
    });

    test.each(
      Object.values(EventStatus).filter(
        (status) => status !== EventStatus.SCHEDULED,
      ),
    )('SCHEDULED 상태의 이벤트가 아니라면 에러를 던진다.', (status) => {
      const event = eventOf({ status });

      expect.assertions(2);
      try {
        event.cancel();
      } catch (e) {
        expect(e.message).toBe('Event is not SCHEDULED');
        expect(e.getResponse().errorMessage).toBe(
          '이벤트가 대기상태가 아닙니다.',
        );
      }
    });
  });
});
