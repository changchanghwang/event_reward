import { Test, TestingModule } from '@nestjs/testing';
import { EventStatus } from '@services/events/domain/model';
import { EventRepository } from '@services/events/infrastructure/repository';
import { RegisterRewardValidator } from '@services/rewards/domain/services';
import { eventOf } from '@test';

describe('RegisterRewardValidator test', () => {
  let registerRewardValidator: RegisterRewardValidator;
  let eventRepository: EventRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterRewardValidator,
        {
          provide: 'EventRepository',
          useValue: {
            findOneOrFail: jest.fn(),
          },
        },
      ],
    }).compile();
    registerRewardValidator = module.get<RegisterRewardValidator>(
      RegisterRewardValidator,
    );
    eventRepository = module.get<EventRepository>('EventRepository');
  });

  describe('validate test', () => {
    test.each([EventStatus.SCHEDULED, EventStatus.PROCESSING])(
      '이벤트가 %s 상태인 경우 보상을 등록할 수 있다.',
      async (status) => {
        jest.spyOn(eventRepository, 'findOneOrFail').mockResolvedValue(
          eventOf({
            id: '1',
            status,
          }),
        );

        await registerRewardValidator.validate('1');
      },
    );
  });
});
