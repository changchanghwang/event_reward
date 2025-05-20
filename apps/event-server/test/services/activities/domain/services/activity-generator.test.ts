import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing';
import { ActivityGenerator } from '@services/activities/domain/services';
import { ActivityRepository } from '@services/activities/infrastructure/repository';
import { EventType } from '@services/events/domain/model';
import { activityOf } from '@test';
import { v7 } from 'uuid';

jest.mock('uuid');

describe('ActivityGenerator test', () => {
  let activityGenerator: ActivityGenerator;
  let activityRepository: ActivityRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityGenerator,
        {
          provide: 'ActivityRepository',
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();
    activityGenerator = module.get<ActivityGenerator>(ActivityGenerator);
    activityRepository = module.get<ActivityRepository>('ActivityRepository');
  });

  beforeEach(() => {
    const mockedUuid = v7 as jest.Mock<string>;
    mockedUuid.mockReturnValue('test-id');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generate test', () => {
    test('event type이 ATTENDANCE가 아니면 에러를 던진다.', async () => {
      const eventType = 'TEST' as EventType;

      await expect(
        activityGenerator.generate(
          'test-event-id',
          'test-user-id',
          eventType,
          '2025-05-16',
        ),
      ).rejects.toThrow(`Unsupported event type: TEST`);
    });

    test('오늘 참여를 이미 했다면 undefined를 반환한다.', async () => {
      const eventType = EventType.ATTENDANCE;

      jest.spyOn(activityRepository, 'find').mockResolvedValue([
        activityOf({
          eventId: 'test-event-id',
          userId: 'test-user-id',
          participatedOn: '2025-05-16',
        }),
      ]);

      await expect(
        activityGenerator.generate(
          'test-event-id',
          'test-user-id',
          eventType,
          '2025-05-16',
        ),
      ).resolves.toBeUndefined();
    });

    test('오늘 참여를 하지 않았다면 참여 활동을 생성한다.', async () => {
      const eventType = EventType.ATTENDANCE;

      jest.spyOn(activityRepository, 'find').mockResolvedValue([]);

      await expect(
        activityGenerator.generate(
          'test-event-id',
          'test-user-id',
          eventType,
          '2025-05-16',
        ),
      ).resolves.toEqual({
        _events: [
          {
            type: 'ActivityRegisteredEvent',
            activityId: 'test-id',
            eventId: 'test-event-id',
            userId: 'test-user-id',
            participatedOn: '2025-05-16',
            occurredAt: expect.any(Date),
          },
        ],
        eventId: 'test-event-id',
        id: 'test-id',
        participatedOn: '2025-05-16',
        userId: 'test-user-id',
      });
    });
  });
});
