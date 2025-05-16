import { Module } from '@nestjs/common';
import { RewardRepositoryImpl } from './infrastructure/repository-impl';
import { RewardController } from './presentation/controller';
import { RewardService } from './application';
import { DatabaseModule } from '@libs/db/module';
import { RegisterRewardValidator } from '@services/rewards/domain/services';
import { EventsModule } from '@services/events/module';

@Module({
  imports: [DatabaseModule, EventsModule],
  controllers: [RewardController],
  providers: [
    RewardService,
    {
      provide: 'RewardRepository',
      useClass: RewardRepositoryImpl,
    },
    RegisterRewardValidator,
  ],
})
export class RewardsModule {}
