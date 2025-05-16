import { Module } from '@nestjs/common';
import { RewardRequestRepositoryImpl } from './infrastructure/repository-impl';
import { RewardRequestController } from './presentation/controller';
import { RewardRequestService } from './application';
import { RewardsModule } from '@services/rewards/module';
import { EventsModule } from '@services/events/module';
import { RewardRequestValidator } from '@services/reward-requests/domain/services/reward-request-validator';

@Module({
  imports: [RewardsModule, EventsModule],
  controllers: [RewardRequestController],
  providers: [
    RewardRequestService,
    {
      provide: 'RewardRequestRepository',
      useClass: RewardRequestRepositoryImpl,
    },
    RewardRequestValidator,
  ],
  exports: ['RewardRequestRepository'],
})
export class RewardRequestsModule {}
