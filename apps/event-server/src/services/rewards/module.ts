import { Module } from '@nestjs/common';
import { RewardRepositoryImpl } from './infrastructure/repository-impl';
import { RewardController } from './presentation/controller';
import { RewardService } from './application';
import { DatabaseModule } from '@libs/db/module';

@Module({
  imports: [DatabaseModule],
  controllers: [RewardController],
  providers: [
    RewardService,
    {
      provide: 'RewardRepository',
      useClass: RewardRepositoryImpl,
    },
  ],
})
export class RewardsModule {}
