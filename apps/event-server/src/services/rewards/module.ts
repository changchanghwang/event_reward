import { Module } from '@nestjs/common';
import { RewardRepositoryImpl } from './infrastructure/repository-impl';
import { RewardController } from './presentation/controller';
import { RewardService } from './application';
import { RegisterRewardValidator } from '@services/rewards/domain/services';
import { EventsModule } from '@services/events/module';

@Module({
  imports: [EventsModule],
  controllers: [RewardController],
  providers: [
    RewardService,
    {
      provide: 'RewardRepository',
      useClass: RewardRepositoryImpl,
    },
    RegisterRewardValidator,
  ],
  exports: ['RewardRepository'],
})
export class RewardsModule {}
