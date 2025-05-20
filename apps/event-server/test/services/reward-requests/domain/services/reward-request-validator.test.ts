import { Test } from '@nestjs/testing';

import { TestingModule } from '@nestjs/testing';
import { ActivityRepository } from '@services/activities/infrastructure/repository';
import { EventStatus } from '@services/events/domain/model';
import { RewardRequestStatus } from '@services/reward-requests/domain/model';
import { RewardRequestValidator } from '@services/reward-requests/domain/services';
import { RewardRequestRepository } from '@services/reward-requests/infrastructure/repository';
import { activityOf, eventOf, rewardOf, rewardRequestOf } from '@test';

describe('RewardRequestValidator test', () => {
  let rewardRequestValidator: RewardRequestValidator;
  let activityRepository: ActivityRepository;
  let rewardRequestRepository: RewardRequestRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardRequestValidator,
        {
          provide: 'ActivityRepository',
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: 'RewardRequestRepository',
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();
    rewardRequestValidator = module.get<RewardRequestValidator>(
      RewardRequestValidator,
    );
    activityRepository = module.get<ActivityRepository>('ActivityRepository');
    rewardRequestRepository = module.get<RewardRequestRepository>(
      'RewardRequestRepository',
    );
  });

  describe('validate test', () => {
    test.each(
      Object.values(EventStatus).filter(
        (status) =>
          status !== EventStatus.PROCESSING && status !== EventStatus.COMPLETED,
      ),
    )(
      '이벤트가 reward 지급 가능한 상태가 아니라면 에러를 던진다 - status: %s',
      async (status) => {
        const event = eventOf({
          status,
          id: 'test-event-id',
        });

        const reward = rewardOf({
          isManual: false,
        });

        const userId = 'test-user-id';

        await expect(
          rewardRequestValidator.validate({ userId, event, reward }),
        ).rejects.toThrow(`Event(test-event-id) is not eligible for reward.`);
      },
    );

    test('이미 보상 요청이 존재하면 에러를 던진다.', async () => {
      const event = eventOf({
        status: EventStatus.PROCESSING,
        id: 'test-event-id',
      });

      const reward = rewardOf({
        isManual: false,
      });

      const userId = 'test-user-id';

      jest.spyOn(rewardRequestRepository, 'find').mockResolvedValue([
        rewardRequestOf({
          userId,
          eventId: event.id,
        }),
      ]);

      await expect(
        rewardRequestValidator.validate({ userId, event, reward }),
      ).rejects.toThrow(`Reward request already exists.`);
    });

    test('보상이 수동으로 주어지는 것이라면 REQUESTED 상태를 반환한다.', async () => {
      const event = eventOf({
        status: EventStatus.PROCESSING,
        id: 'test-event-id',
      });

      const reward = rewardOf({
        isManual: true,
      });

      const userId = 'test-user-id';

      jest.spyOn(rewardRequestRepository, 'find').mockResolvedValue([]);

      await expect(
        rewardRequestValidator.validate({ userId, event, reward }),
      ).resolves.toBe(RewardRequestStatus.REQUESTED);
    });

    describe('보상이 자동으로 주어지는 것이라면 참여 횟수에 따라 상태를 결정한다', () => {
      test('참여 횟수가 보상 지급 기준에 도달하지 않으면 REJECTED 상태를 반환한다.', async () => {
        const event = eventOf({
          status: EventStatus.PROCESSING,
          id: 'test-event-id',
        });

        const reward = rewardOf({
          isManual: false,
          required: 10,
        });

        const userId = 'test-user-id';

        jest.spyOn(rewardRequestRepository, 'find').mockResolvedValue([]);
        jest.spyOn(activityRepository, 'find').mockResolvedValue([
          activityOf({
            userId,
            eventId: event.id,
          }),
        ]);

        await expect(
          rewardRequestValidator.validate({ userId, event, reward }),
        ).resolves.toBe(RewardRequestStatus.REJECTED);
      });

      test('참여 횟수가 보상 지급 기준에 도달하면 APPROVED 상태를 반환한다.', async () => {
        const event = eventOf({
          status: EventStatus.PROCESSING,
          id: 'test-event-id',
        });

        const reward = rewardOf({
          isManual: false,
          required: 1,
        });

        const userId = 'test-user-id';

        jest.spyOn(rewardRequestRepository, 'find').mockResolvedValue([]);
        jest
          .spyOn(activityRepository, 'find')
          .mockResolvedValue([activityOf({ userId, eventId: event.id })]);

        await expect(
          rewardRequestValidator.validate({ userId, event, reward }),
        ).resolves.toBe(RewardRequestStatus.APPROVED);
      });
    });
  });
});
