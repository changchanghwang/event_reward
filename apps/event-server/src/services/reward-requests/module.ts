import { Module } from '@nestjs/common';
import { RewardRequestRepositoryImpl } from './infrastructure/repository-impl';
import { RewardRequestController } from './presentation/controller';
import { RewardRequestService } from './application';
import { RewardsModule } from '@services/rewards/module';
import { EventsModule } from '@services/events/module';

@Module({
  imports: [RewardsModule, EventsModule],
  controllers: [RewardRequestController],
  providers: [
    RewardRequestService,
    {
      provide: 'RewardRequestRepository',
      useClass: RewardRequestRepositoryImpl,
    },
  ],
  exports: ['RewardRequestRepository'],
})
export class RewardRequestsModule {}
